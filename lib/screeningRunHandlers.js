import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';
import { isRequestValidationError, readJsonBody } from '@/lib/requestValidation';

function cleanRun(run) {
    return {
        id: run.id,
        projectId: run.projectId,
        inputs: run.inputs,
        outputs: run.outputs,
        sweep: run.sweep,
        assumptions: run.assumptions,
        createdAt: run.createdAt,
    };
}

async function authorize() {
    const database = await getPhoenixDatabase();
    if (!database)
        return { error: NextResponse.json({ error: 'MongoDB is required to save engineering runs.' }, { status: 503 }) };

    const user = await getSessionUser(database);
    if (!user)
        return { error: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };

    return { database, user };
}

export function createScreeningRunHandlers({ calculate, projectId, runPrefix, label }) {
    return {
        async GET() {
            try {
                const authorized = await authorize();
                if (authorized.error)
                    return authorized.error;

                const runs = await authorized.database.collection('screeningRuns')
                    .find({ userId: authorized.user._id, projectId })
                    .sort({ createdAt: -1 })
                    .limit(12)
                    .toArray();
                return NextResponse.json({ runs: runs.map(cleanRun) });
            }
            catch (error) {
                console.error(`Unable to load ${label} runs:`, error);
                return NextResponse.json({ error: `Unable to load saved ${label} runs.` }, { status: 500 });
            }
        },
        async POST(request) {
            try {
                const authorized = await authorize();
                if (authorized.error)
                    return authorized.error;

                const result = calculate(await readJsonBody(request, { maxBytes: 16 * 1024 }));
                const run = {
                    id: `${runPrefix}-${randomUUID()}`,
                    projectId,
                    userId: authorized.user._id,
                    ...result,
                    createdAt: new Date(),
                };
                await authorized.database.collection('screeningRuns').insertOne(run);
                return NextResponse.json({ run: cleanRun(run) }, { status: 201 });
            }
            catch (error) {
                if (isRequestValidationError(error))
                    return NextResponse.json({ error: error.message }, { status: error.status });
                if (error.message?.includes('must be between') || error.message?.includes('whole number') || error.message?.includes('unusable Arrhenius estimate'))
                    return NextResponse.json({ error: error.message }, { status: 400 });
                console.error(`Unable to create ${label} run:`, error);
                return NextResponse.json({ error: `Unable to calculate and save this ${label} run.` }, { status: 500 });
            }
        },
        async DELETE(request) {
            try {
                const authorized = await authorize();
                if (authorized.error)
                    return authorized.error;

                const { runId } = await readJsonBody(request, { maxBytes: 2048 });
                if (typeof runId !== 'string' || !runId.startsWith(`${runPrefix}-`))
                    return NextResponse.json({ error: `A valid saved ${label} run is required.` }, { status: 400 });

                await authorized.database.collection('screeningRuns').deleteOne({
                    id: runId,
                    userId: authorized.user._id,
                    projectId,
                });
                return NextResponse.json({ deleted: true });
            }
            catch (error) {
                if (isRequestValidationError(error))
                    return NextResponse.json({ error: error.message }, { status: error.status });
                console.error(`Unable to delete ${label} run:`, error);
                return NextResponse.json({ error: `Unable to delete this ${label} run.` }, { status: 500 });
            }
        },
    };
}

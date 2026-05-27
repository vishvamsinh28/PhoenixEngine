import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';
import { calculateThermalScreening, THERMAL_PROJECT_ID } from '@/lib/thermalAnalysis';

export const dynamic = 'force-dynamic';

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

async function getAuthorizedDatabase() {
    const database = await getPhoenixDatabase();
    if (!database)
        return { error: NextResponse.json({ error: 'MongoDB is required to save thermal runs.' }, { status: 503 }) };

    const user = await getSessionUser(database);
    if (!user)
        return { error: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };

    return { database, user };
}

export async function GET() {
    try {
        const authorized = await getAuthorizedDatabase();
        if (authorized.error)
            return authorized.error;

        const runs = await authorized.database.collection('thermalRuns')
            .find({ userId: authorized.user._id, projectId: THERMAL_PROJECT_ID })
            .sort({ createdAt: -1 })
            .limit(12)
            .toArray();

        return NextResponse.json({ runs: runs.map(cleanRun) });
    }
    catch (error) {
        console.error('Unable to load thermal screening runs:', error);
        return NextResponse.json({ error: 'Unable to load saved thermal runs.' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authorized = await getAuthorizedDatabase();
        if (authorized.error)
            return authorized.error;

        const body = await request.json();
        const result = calculateThermalScreening(body);
        const run = {
            id: `thermal-${randomUUID()}`,
            projectId: THERMAL_PROJECT_ID,
            userId: authorized.user._id,
            ...result,
            createdAt: new Date(),
        };

        await authorized.database.collection('thermalRuns').insertOne(run);
        return NextResponse.json({ run: cleanRun(run) }, { status: 201 });
    }
    catch (error) {
        if (error.message?.includes('must be between'))
            return NextResponse.json({ error: error.message }, { status: 400 });

        console.error('Unable to create thermal screening run:', error);
        return NextResponse.json({ error: 'Unable to calculate and save this thermal run.' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const authorized = await getAuthorizedDatabase();
        if (authorized.error)
            return authorized.error;

        const body = await request.json();
        if (typeof body.runId !== 'string' || !body.runId.startsWith('thermal-'))
            return NextResponse.json({ error: 'A valid saved thermal run is required.' }, { status: 400 });

        await authorized.database.collection('thermalRuns').deleteOne({
            id: body.runId,
            userId: authorized.user._id,
            projectId: THERMAL_PROJECT_ID,
        });
        return NextResponse.json({ deleted: true });
    }
    catch (error) {
        console.error('Unable to delete thermal screening run:', error);
        return NextResponse.json({ error: 'Unable to delete this thermal run.' }, { status: 500 });
    }
}

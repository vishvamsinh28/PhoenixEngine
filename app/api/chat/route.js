import { NextResponse } from 'next/server';
import { projectById } from '@/data/engineData';
import { getSessionUser } from '@/lib/auth';
import { generateEngineeringAnswer } from '@/lib/gemini';
import { getPhoenixDatabase } from '@/lib/mongodb';
import { isRequestValidationError, readJsonBody } from '@/lib/requestValidation';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const database = await getPhoenixDatabase();
        if (!database) {
            return NextResponse.json({ error: 'MongoDB is required to save analysis conversations.' }, { status: 503 });
        }

        const user = await getSessionUser(database);
        if (!user) {
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        const body = await readJsonBody(request, { maxBytes: 16 * 1024 });
        const project = projectById(body.projectId);
        const message = typeof body.message === 'string' ? body.message.trim() : '';

        if (!project || !message) {
            return NextResponse.json({ error: 'A valid project and engineering question are required.' }, { status: 400 });
        }
        if (message.length > 4000) {
            return NextResponse.json({ error: 'Message is too long. Keep engineering questions under 4000 characters.' }, { status: 413 });
        }

        const storedHistory = await database.collection('messages')
            .find({ userId: user._id, projectId: project.id })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
        const history = storedHistory.reverse().map((storedMessage) => ({
            sender: storedMessage.sender,
            message: storedMessage.message,
        }));
        const userMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            message,
            projectId: project.id,
            userId: user._id,
            createdAt: new Date(),
        };
        const assistantText = await generateEngineeringAnswer({
                project,
                messages: [...history, userMessage],
                signal: request.signal,
        });
        if (!assistantText) {
            return NextResponse.json({ error: 'The analysis engine is not configured.' }, { status: 503 });
        }

        const assistantMessage = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            message: assistantText,
            projectId: project.id,
            userId: user._id,
            createdAt: new Date(),
        };
        if (request.signal.aborted) {
            return NextResponse.json({ error: 'Generation stopped.' }, { status: 499 });
        }
        await database.collection('messages').insertMany([userMessage, assistantMessage]);

        return NextResponse.json({
            message: { id: assistantMessage.id, sender: assistantMessage.sender, message: assistantMessage.message },
            persisted: true,
        });
    }
    catch (error) {
        if (isRequestValidationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: 'Generation stopped.' }, { status: 499 });
        }
        console.error('Phoenix Engine chat request failed:', error);
        return NextResponse.json({ error: 'Unable to complete this engineering run.' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { projectById } from '@/data/engineData';
import { generateFallbackAnswer } from '@/lib/fallbackEngine';
import { generateEngineeringAnswer } from '@/lib/gemini';
import { getPhoenixDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const project = projectById(body.projectId);
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
        const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];

        if (!project || !message) {
            return NextResponse.json({ error: 'A valid project and engineering question are required.' }, { status: 400 });
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            message,
            projectId: project.id,
            attachments,
            createdAt: new Date(),
        };
        let assistantText;
        let source = 'gemini';

        try {
            assistantText = await generateEngineeringAnswer({
                project,
                messages: [...history, userMessage],
                attachments,
            });
        }
        catch (error) {
            console.error('Gemini response failed:', error);
            assistantText = null;
        }

        if (!assistantText) {
            source = 'demo';
            assistantText = generateFallbackAnswer({ project, message, attachments });
        }

        const assistantMessage = {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            message: assistantText,
            projectId: project.id,
            createdAt: new Date(),
        };
        const database = await getPhoenixDatabase().catch((error) => {
            console.error('MongoDB persistence unavailable:', error);
            return null;
        });

        if (database) {
            await database.collection('messages').insertMany([userMessage, assistantMessage]);
        }

        return NextResponse.json({
            message: { id: assistantMessage.id, sender: assistantMessage.sender, message: assistantMessage.message },
            source,
            persisted: Boolean(database),
        });
    }
    catch (error) {
        console.error('Phoenix Engine chat request failed:', error);
        return NextResponse.json({ error: 'Unable to complete this engineering run.' }, { status: 500 });
    }
}

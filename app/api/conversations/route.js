import { NextResponse } from 'next/server';
import { projects, emptyMessagesByProject } from '@/data/engineData';
import { getSessionUser } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const database = await getPhoenixDatabase();
        if (!database) {
            return NextResponse.json({ error: 'MongoDB is required to load conversations.' }, { status: 503 });
        }

        const user = await getSessionUser(database);
        if (!user) {
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        const storedMessages = await database.collection('messages').find({ userId: user._id }).sort({ createdAt: 1 }).toArray();
        const messagesByProject = { ...emptyMessagesByProject };
        storedMessages.forEach((message) => {
            const cleanMessage = { id: message.id, sender: message.sender, message: message.message };
            messagesByProject[message.projectId] = [...(messagesByProject[message.projectId] || []), cleanMessage];
        });

        return NextResponse.json({ projects, messagesByProject });
    }
    catch (error) {
        console.error('Unable to load Phoenix Engine projects:', error);
        return NextResponse.json({ error: 'Unable to load conversations.' }, { status: 500 });
    }
}

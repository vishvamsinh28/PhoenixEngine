import { NextResponse } from 'next/server';
import { projects, messagesByProject } from '@/data/engineData';
import { getPhoenixDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const database = await getPhoenixDatabase();

        if (!database) {
            return NextResponse.json({ projects, messagesByProject, persistence: 'demo' });
        }

        const storedProjects = await database.collection('projects').find({}).toArray();
        const storedMessages = await database.collection('messages').find({}).sort({ createdAt: 1 }).toArray();
        const mergedProjects = projects.map((project) => storedProjects.find((item) => item.id === project.id) || project);
        const mergedMessages = { ...messagesByProject };

        storedMessages.forEach((message) => {
            const cleanMessage = { id: message.id, sender: message.sender, message: message.message };
            mergedMessages[message.projectId] = [...(mergedMessages[message.projectId] || []), cleanMessage];
        });

        return NextResponse.json({ projects: mergedProjects, messagesByProject: mergedMessages, persistence: 'mongodb' });
    }
    catch (error) {
        console.error('Unable to load Phoenix Engine projects:', error);
        return NextResponse.json({ projects, messagesByProject, persistence: 'demo' });
    }
}

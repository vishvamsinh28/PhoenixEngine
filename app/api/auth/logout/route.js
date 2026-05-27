import { NextResponse } from 'next/server';
import { clearSessionCookie, deleteCurrentSession } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';

export async function POST() {
    const database = await getPhoenixDatabase();
    if (database) {
        await deleteCurrentSession(database);
    }

    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
}

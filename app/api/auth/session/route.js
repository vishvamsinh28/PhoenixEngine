import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';

export async function GET() {
    const database = await getPhoenixDatabase();
    if (!database) {
        return NextResponse.json({ user: null });
    }

    const user = await getSessionUser(database);
    return NextResponse.json({ user: user ? { name: user.name, email: user.email } : null });
}

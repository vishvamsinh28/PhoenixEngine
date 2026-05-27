import { NextResponse } from 'next/server';
import { createSession, normalizeEmail, setSessionCookie, verifyPassword } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';

export async function POST(request) {
    const database = await getPhoenixDatabase();
    if (!database) {
        return NextResponse.json({ error: 'Authentication requires MongoDB configuration.' }, { status: 503 });
    }

    const body = await request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const user = await database.collection('users').findOne({ email });

    if (!user || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const session = await createSession(database, user._id);
    const response = NextResponse.json({ user: { name: user.name, email: user.email } });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
}

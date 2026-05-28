import { NextResponse } from 'next/server';
import { createSession, normalizeEmail, serializeAuthenticatedUser, setSessionCookie, verifyPassword } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';
import { isRequestValidationError, readJsonBody } from '@/lib/requestValidation';

export async function POST(request) {
    try {
        const database = await getPhoenixDatabase();
        if (!database) {
            return NextResponse.json({ error: 'Authentication requires MongoDB configuration.' }, { status: 503 });
        }

        const body = await readJsonBody(request, { maxBytes: 4096 });
        const email = normalizeEmail(body.email);
        const password = String(body.password || '');
        if (email.length > 254 || password.length > 256) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }
        const user = await database.collection('users').findOne({ email });

        if (!user || !verifyPassword(password, user.passwordHash)) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }

        const session = await createSession(database, user._id);
        const response = NextResponse.json({
            user: serializeAuthenticatedUser(user, session.expiresAt),
        });
        setSessionCookie(response, session.token, session.expiresAt);
        return response;
    }
    catch (error) {
        if (isRequestValidationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Login failed:', error);
        return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 });
    }
}

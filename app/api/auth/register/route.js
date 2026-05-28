import { NextResponse } from 'next/server';
import { createSession, hashPassword, isValidEmail, normalizeEmail, serializeAuthenticatedUser, setSessionCookie } from '@/lib/auth';
import { getPhoenixDatabase } from '@/lib/mongodb';
import { isRequestValidationError, readJsonBody } from '@/lib/requestValidation';

export async function POST(request) {
    const database = await getPhoenixDatabase();
    if (!database) {
        return NextResponse.json({ error: 'Authentication requires MongoDB configuration.' }, { status: 503 });
    }

    const body = await readJsonBody(request, { maxBytes: 4096 });
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');

    if (name.length < 2 || name.length > 80 || email.length > 254 || !isValidEmail(email) || password.length < 8 || password.length > 256) {
        return NextResponse.json({ error: 'Enter a name, valid email, and password of at least 8 characters.' }, { status: 400 });
    }

    try {
        const result = await database.collection('users').insertOne({
            name,
            email,
            passwordHash: hashPassword(password),
            createdAt: new Date(),
        });
        const session = await createSession(database, result.insertedId);
        const response = NextResponse.json({
            user: serializeAuthenticatedUser({ name, email }, session.expiresAt),
        }, { status: 201 });
        setSessionCookie(response, session.token, session.expiresAt);
        return response;
    }
    catch (error) {
        if (isRequestValidationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        if (error.code === 11000) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }
        console.error('Registration failed:', error);
        return NextResponse.json({ error: 'Unable to create your account.' }, { status: 500 });
    }
}

import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'phoenix_session';
const DEFAULT_SESSION_DAYS = 365;

function getSessionDays() {
    const configuredDays = Number(process.env.SESSION_DAYS);
    return Number.isFinite(configuredDays) && configuredDays > 0
        ? configuredDays
        : DEFAULT_SESSION_DAYS;
}

export function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
    const [salt, expectedHash] = String(storedPassword || '').split(':');
    if (!salt || !expectedHash)
        return false;

    const actual = Buffer.from(scryptSync(password, salt, 64).toString('hex'), 'hex');
    const expected = Buffer.from(expectedHash, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

export async function createSession(database, userId) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + getSessionDays() * 24 * 60 * 60 * 1000);

    await database.collection('sessions').insertOne({
        tokenHash: hashToken(token),
        userId,
        expiresAt,
        createdAt: new Date(),
    });

    return { token, expiresAt };
}

export function serializeAuthenticatedUser(user, sessionExpiresAt) {
    return {
        name: user.name,
        email: user.email,
        sessionExpiresAt: sessionExpiresAt instanceof Date
            ? sessionExpiresAt.toISOString()
            : sessionExpiresAt,
    };
}

export function setSessionCookie(response, token, expiresAt) {
    response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: expiresAt,
    });
}

export function clearSessionCookie(response) {
    response.cookies.set(SESSION_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
}

export async function getSessionUser(database) {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token)
        return null;

    const session = await database.collection('sessions').findOne({
        tokenHash: hashToken(token),
        expiresAt: { $gt: new Date() },
    });
    if (!session)
        return null;

    const user = await database.collection('users').findOne(
        { _id: session.userId },
        { projection: { passwordHash: 0 } },
    );
    if (!user)
        return null;

    return {
        ...user,
        sessionExpiresAt: session.expiresAt,
    };
}

export async function deleteCurrentSession(database) {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (token) {
        await database.collection('sessions').deleteOne({ tokenHash: hashToken(token) });
    }
}

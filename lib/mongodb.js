import { MongoClient, ServerApiVersion } from 'mongodb';

let clientPromise;
let indexPromise;

function getDatabaseName(uri) {
    try {
        const pathname = new URL(uri).pathname.replace(/^\//, '');
        return pathname || 'phoenix_engine';
    }
    catch {
        return 'phoenix_engine';
    }
}

export async function getPhoenixDatabase() {
    const uri = process.env.MONGO_DATABASE_URL;

    if (!uri) {
        return null;
    }

    if (!clientPromise) {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        clientPromise = client.connect();
    }

    const client = await clientPromise;
    const database = client.db(getDatabaseName(uri));

    if (!indexPromise) {
        indexPromise = Promise.all([
            database.collection('users').createIndex({ email: 1 }, { unique: true }),
            database.collection('sessions').createIndex({ tokenHash: 1 }, { unique: true }),
            database.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
            database.collection('messages').createIndex({ userId: 1, projectId: 1, createdAt: 1 }),
        ]);
    }

    await indexPromise;
    return database;
}

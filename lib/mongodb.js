import { MongoClient, ServerApiVersion } from 'mongodb';

let clientPromise;

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
    return client.db(getDatabaseName(uri));
}

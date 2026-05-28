export class RequestValidationError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = 'RequestValidationError';
        this.status = status;
    }
}

export async function readJsonBody(request, { maxBytes = 32 * 1024 } = {}) {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        throw new RequestValidationError('Request body is too large.', 413);
    }

    try {
        return await request.json();
    }
    catch {
        throw new RequestValidationError('Request body must be valid JSON.');
    }
}

export function isRequestValidationError(error) {
    return error instanceof RequestValidationError;
}

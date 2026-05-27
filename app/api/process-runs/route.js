import { calculateProcessModelingScreening, PROCESS_PROJECT_ID } from '@/lib/processModelingAnalysis';
import { createScreeningRunHandlers } from '@/lib/screeningRunHandlers';

export const dynamic = 'force-dynamic';

const handlers = createScreeningRunHandlers({
    calculate: calculateProcessModelingScreening,
    projectId: PROCESS_PROJECT_ID,
    runPrefix: 'process',
    label: 'process modeling',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;

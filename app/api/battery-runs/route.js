import { calculateBatteryCoolingScreening, BATTERY_PROJECT_ID } from '@/lib/batteryCoolingAnalysis';
import { createScreeningRunHandlers } from '@/lib/screeningRunHandlers';

export const dynamic = 'force-dynamic';

const handlers = createScreeningRunHandlers({
    calculate: calculateBatteryCoolingScreening,
    projectId: BATTERY_PROJECT_ID,
    runPrefix: 'battery',
    label: 'battery cooling',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;

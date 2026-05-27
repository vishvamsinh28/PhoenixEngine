import { calculateAerodynamicsScreening, AERODYNAMICS_PROJECT_ID } from '@/lib/aerodynamicsAnalysis';
import { createScreeningRunHandlers } from '@/lib/screeningRunHandlers';

export const dynamic = 'force-dynamic';

const handlers = createScreeningRunHandlers({
    calculate: calculateAerodynamicsScreening,
    projectId: AERODYNAMICS_PROJECT_ID,
    runPrefix: 'aero',
    label: 'aerodynamics',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;

import { createScreeningRunHandlers } from '@/lib/screeningRunHandlers';
import { calculateSimulationStudioRun, SIMULATION_STUDIO_PROJECT_ID } from '@/lib/simulationStudioAnalysis';

export const dynamic = 'force-dynamic';

const handlers = createScreeningRunHandlers({
    calculate: calculateSimulationStudioRun,
    projectId: SIMULATION_STUDIO_PROJECT_ID,
    runPrefix: 'sim3d',
    label: '3D simulation',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const DELETE = handlers.DELETE;

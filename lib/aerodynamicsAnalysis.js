export const AERODYNAMICS_PROJECT_ID = 'winglet-flow';

const FIELD_RULES = {
    velocityMS: { label: 'Freestream velocity', min: 0.01, max: 100 },
    densityKgM3: { label: 'Fluid density', min: 0.01, max: 50 },
    viscosityPaS: { label: 'Dynamic viscosity', min: 0.000001, max: 1 },
    referenceAreaM2: { label: 'Reference area', min: 0.000001, max: 100000 },
    characteristicLengthM: { label: 'Characteristic length', min: 0.000001, max: 10000 },
    dragCoefficient: { label: 'Drag coefficient', min: 0, max: 20 },
    liftCoefficient: { label: 'Lift coefficient', min: -20, max: 20 },
    dragLimitN: { label: 'Drag force limit', min: 0, max: 1000000000 },
};

function rounded(value, decimals = 2) {
    return Number(value.toFixed(decimals));
}

function validateInput(input) {
    return Object.fromEntries(Object.entries(FIELD_RULES).map(([name, rule]) => {
        const value = Number(input[name]);
        if (!Number.isFinite(value) || value < rule.min || value > rule.max)
            throw new Error(`${rule.label} must be between ${rule.min} and ${rule.max}.`);
        return [name, value];
    }));
}

function forcesAtSpeed(input, velocityMS) {
    const dynamicPressurePa = 0.5 * input.densityKgM3 * velocityMS ** 2;
    return {
        dynamicPressurePa,
        dragN: dynamicPressurePa * input.referenceAreaM2 * input.dragCoefficient,
        liftN: dynamicPressurePa * input.referenceAreaM2 * input.liftCoefficient,
    };
}

export function calculateAerodynamicsScreening(input) {
    const normalized = validateInput(input);
    const forces = forcesAtSpeed(normalized, normalized.velocityMS);
    const reynoldsNumber = (normalized.densityKgM3 * normalized.velocityMS * normalized.characteristicLengthM) / normalized.viscosityPaS;
    const dragMarginN = normalized.dragLimitN - forces.dragN;
    const status = dragMarginN < 0
        ? 'Exceeds drag-force limit'
        : dragMarginN < normalized.dragLimitN * 0.1
            ? 'Near drag-force limit'
            : 'Within drag-force target';

    return {
        inputs: normalized,
        outputs: {
            dynamicPressurePa: rounded(forces.dynamicPressurePa, 1),
            reynoldsNumber: rounded(reynoldsNumber, 0),
            dragN: rounded(forces.dragN, 2),
            liftN: rounded(forces.liftN, 2),
            liftToDrag: normalized.dragCoefficient > 0 ? rounded(normalized.liftCoefficient / normalized.dragCoefficient, 2) : null,
            dragMarginN: rounded(dragMarginN, 2),
            status,
        },
        sweep: [0.5, 1, 1.5].map((factor) => {
            const speed = normalized.velocityMS * factor;
            const point = forcesAtSpeed(normalized, speed);
            return {
                label: `${factor}x velocity`,
                velocityMS: rounded(speed, 1),
                dragN: rounded(point.dragN, 2),
            };
        }),
        assumptions: [
            'Incompressible, steady external flow screening only; velocity is restricted below 100 m/s.',
            'Lift and drag coefficients are user-supplied inputs from test data, trusted correlations, or higher-fidelity analysis.',
            'Forces use q = 0.5 rho V^2, D = q A Cd, L = q A Cl, and Re = rho V L / mu.',
            'Stall, compressibility, induced drag breakdown, turbulence transition, and geometry effects are not predicted.',
        ],
    };
}

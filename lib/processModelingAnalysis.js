export const PROCESS_PROJECT_ID = 'wafer-deposition';
const GAS_CONSTANT_J_MOL_K = 8.314462618;

const FIELD_RULES = {
    centerRateNmMin: { label: 'Center deposition rate', min: 0.000001, max: 1000000 },
    centerTemperatureC: { label: 'Center temperature', min: -250, max: 2000 },
    edgeTemperatureC: { label: 'Edge temperature', min: -250, max: 2000 },
    activationEnergyKJMol: { label: 'Activation energy', min: 0, max: 1000 },
    processTimeMin: { label: 'Process duration', min: 0.000001, max: 1000000 },
    targetThicknessNm: { label: 'Target thickness', min: 0.000001, max: 1000000000 },
    maxNonuniformityPercent: { label: 'Maximum non-uniformity', min: 0, max: 100 },
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

function depositionAtEdgeTemperature(input, edgeTemperatureC) {
    const centerTemperatureK = input.centerTemperatureC + 273.15;
    const edgeTemperatureK = edgeTemperatureC + 273.15;
    const activationEnergyJMol = input.activationEnergyKJMol * 1000;
    const edgeRateNmMin = input.centerRateNmMin * Math.exp(
        (-activationEnergyJMol / GAS_CONSTANT_J_MOL_K) * ((1 / edgeTemperatureK) - (1 / centerTemperatureK)),
    );
    const centerThicknessNm = input.centerRateNmMin * input.processTimeMin;
    const edgeThicknessNm = edgeRateNmMin * input.processTimeMin;
    const meanThicknessNm = (centerThicknessNm + edgeThicknessNm) / 2;
    const nonuniformityPercent = (Math.abs(centerThicknessNm - edgeThicknessNm) / meanThicknessNm) * 100;
    if (![edgeRateNmMin, centerThicknessNm, edgeThicknessNm, meanThicknessNm, nonuniformityPercent].every(Number.isFinite))
        throw new Error('Temperature and activation energy combination produces an unusable Arrhenius estimate.');
    return { edgeRateNmMin, centerThicknessNm, edgeThicknessNm, meanThicknessNm, nonuniformityPercent };
}

export function calculateProcessModelingScreening(input) {
    const normalized = validateInput(input);
    const result = depositionAtEdgeTemperature(normalized, normalized.edgeTemperatureC);
    const nonuniformityMarginPercent = normalized.maxNonuniformityPercent - result.nonuniformityPercent;
    const meanTargetErrorPercent = ((result.meanThicknessNm - normalized.targetThicknessNm) / normalized.targetThicknessNm) * 100;
    const status = nonuniformityMarginPercent < 0
        ? 'Exceeds non-uniformity limit'
        : Math.abs(meanTargetErrorPercent) > 10
            ? 'Uniformity passes; mean thickness misses target'
            : 'Within screening targets';

    return {
        inputs: normalized,
        outputs: {
            centerThicknessNm: rounded(result.centerThicknessNm, 2),
            edgeThicknessNm: rounded(result.edgeThicknessNm, 2),
            meanThicknessNm: rounded(result.meanThicknessNm, 2),
            edgeRateNmMin: rounded(result.edgeRateNmMin, 3),
            nonuniformityPercent: rounded(result.nonuniformityPercent, 2),
            nonuniformityMarginPercent: rounded(nonuniformityMarginPercent, 2),
            meanTargetErrorPercent: rounded(meanTargetErrorPercent, 2),
            status,
        },
        sweep: [-5, 0, 5].map((offsetC) => {
            const temperatureC = normalized.edgeTemperatureC + offsetC;
            const point = depositionAtEdgeTemperature(normalized, temperatureC);
            return {
                label: offsetC === 0 ? 'Nominal edge T' : `${offsetC > 0 ? '+' : ''}${offsetC} C edge T`,
                edgeTemperatureC: rounded(temperatureC, 1),
                edgeThicknessNm: rounded(point.edgeThicknessNm, 2),
                nonuniformityPercent: rounded(point.nonuniformityPercent, 2),
            };
        }),
        assumptions: [
            'Reaction-limited deposition is assumed, with local rate following an Arrhenius temperature dependence.',
            'The supplied center rate calibrates the model at the center temperature; edge rate is inferred only from temperature and activation energy.',
            'Non-uniformity is calculated from center and edge thickness as absolute difference divided by their mean.',
            'Gas depletion, transport limitation, plasma effects, chamber flow, wafer rotation, and intermediate radial behavior are excluded.',
        ],
    };
}

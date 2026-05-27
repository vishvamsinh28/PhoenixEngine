export const THERMAL_PROJECT_ID = 'thermal-inverter';

const FIELD_RULES = {
    powerW: { label: 'Heat load', min: 0.01, max: 100000 },
    effectiveAreaCm2: { label: 'Effective heat-transfer area', min: 0.01, max: 1000000 },
    pathThicknessMm: { label: 'Conduction path thickness', min: 0, max: 10000 },
    conductivityWmK: { label: 'Thermal conductivity', min: 0.001, max: 10000 },
    contactResistanceKW: { label: 'Interface resistance', min: 0, max: 10000 },
    heatTransferCoefficient: { label: 'Heat transfer coefficient', min: 0.01, max: 1000000 },
    ambientC: { label: 'Ambient temperature', min: -273.15, max: 2000 },
    maxTemperatureC: { label: 'Temperature limit', min: -273.15, max: 3000 },
};

function rounded(value, decimals = 2) {
    return Number(value.toFixed(decimals));
}

function requireNumber(input, fieldName) {
    const rule = FIELD_RULES[fieldName];
    const value = Number(input[fieldName]);

    if (!Number.isFinite(value) || value < rule.min || value > rule.max) {
        throw new Error(`${rule.label} must be between ${rule.min} and ${rule.max}.`);
    }

    return value;
}

export function calculateThermalScreening(input) {
    const normalized = Object.fromEntries(
        Object.keys(FIELD_RULES).map((fieldName) => [fieldName, requireNumber(input, fieldName)]),
    );
    const areaM2 = normalized.effectiveAreaCm2 / 10000;
    const pathThicknessM = normalized.pathThicknessMm / 1000;
    const conductionResistance = pathThicknessM / (normalized.conductivityWmK * areaM2);
    const convectionResistance = 1 / (normalized.heatTransferCoefficient * areaM2);
    const totalResistance = conductionResistance + normalized.contactResistanceKW + convectionResistance;
    const temperatureRise = normalized.powerW * totalResistance;
    const predictedTemperature = normalized.ambientC + temperatureRise;
    const margin = normalized.maxTemperatureC - predictedTemperature;
    const sweep = [0.5, 1, 2].map((factor) => {
        const h = normalized.heatTransferCoefficient * factor;
        const resistance = conductionResistance + normalized.contactResistanceKW + (1 / (h * areaM2));
        return {
            label: `${factor}x h`,
            heatTransferCoefficient: rounded(h, 1),
            predictedTemperatureC: rounded(normalized.ambientC + (normalized.powerW * resistance), 1),
        };
    });

    let status = 'Within screening target';
    if (margin < 0)
        status = 'Exceeds temperature limit';
    else if (margin < 10)
        status = 'Near temperature limit';

    return {
        inputs: normalized,
        outputs: {
            areaM2: rounded(areaM2, 5),
            conductionResistanceKW: rounded(conductionResistance, 4),
            convectionResistanceKW: rounded(convectionResistance, 4),
            totalResistanceKW: rounded(totalResistance, 4),
            temperatureRiseC: rounded(temperatureRise, 1),
            predictedTemperatureC: rounded(predictedTemperature, 1),
            marginC: rounded(margin, 1),
            status,
        },
        sweep,
        assumptions: [
            'Steady-state one-dimensional heat flow through a single equivalent thermal path.',
            'Effective area is used for both conduction and convection; spreading and fin efficiency are not resolved.',
            'Radiation, transient heat capacity, contact variation, and airflow pressure drop are excluded.',
            'The h sensitivity sweep varies convection only and is not a CFD or validated FEA result.',
        ],
    };
}

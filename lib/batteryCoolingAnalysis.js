export const BATTERY_PROJECT_ID = 'battery-coldplate';

const FIELD_RULES = {
    heatLoadW: { label: 'Heat load', min: 0.01, max: 10000000 },
    flowRateLMin: { label: 'Total flow rate', min: 0.001, max: 100000 },
    inletTemperatureC: { label: 'Coolant inlet temperature', min: -273.15, max: 1000 },
    maxOutletTemperatureC: { label: 'Maximum coolant outlet temperature', min: -273.15, max: 2000 },
    densityKgM3: { label: 'Coolant density', min: 0.01, max: 5000 },
    specificHeatJKgK: { label: 'Coolant specific heat', min: 0.01, max: 20000 },
    viscosityPaS: { label: 'Coolant viscosity', min: 0.000001, max: 100 },
    channelLengthM: { label: 'Channel length', min: 0.000001, max: 1000 },
    channelWidthMm: { label: 'Channel width', min: 0.001, max: 10000 },
    channelHeightMm: { label: 'Channel height', min: 0.001, max: 10000 },
    parallelChannels: { label: 'Parallel channel count', min: 1, max: 100000 },
};

function rounded(value, decimals = 2) {
    return Number(value.toFixed(decimals));
}

function validateInput(input) {
    return Object.fromEntries(Object.entries(FIELD_RULES).map(([name, rule]) => {
        const value = Number(input[name]);
        if (!Number.isFinite(value) || value < rule.min || value > rule.max)
            throw new Error(`${rule.label} must be between ${rule.min} and ${rule.max}.`);
        if (name === 'parallelChannels' && !Number.isInteger(value))
            throw new Error('Parallel channel count must be a whole number.');
        return [name, value];
    }));
}

function evaluateFlow(input, flowRateLMin) {
    const totalVolumetricFlowM3S = flowRateLMin / 60000;
    const channelVolumetricFlowM3S = totalVolumetricFlowM3S / input.parallelChannels;
    const widthM = input.channelWidthMm / 1000;
    const heightM = input.channelHeightMm / 1000;
    const channelAreaM2 = widthM * heightM;
    const hydraulicDiameterM = (2 * widthM * heightM) / (widthM + heightM);
    const aspectRatio = Math.min(widthM, heightM) / Math.max(widthM, heightM);
    const channelVelocityMS = channelVolumetricFlowM3S / channelAreaM2;
    const reynoldsNumber = (input.densityKgM3 * channelVelocityMS * hydraulicDiameterM) / input.viscosityPaS;
    let frictionFactor;
    let flowRegime;
    const laminarPoiseuilleNumber = 96 * (
        1
        - (1.3553 * aspectRatio)
        + (1.9467 * aspectRatio ** 2)
        - (1.7012 * aspectRatio ** 3)
        + (0.9564 * aspectRatio ** 4)
        - (0.2537 * aspectRatio ** 5)
    );
    const laminarFrictionFactor = laminarPoiseuilleNumber / reynoldsNumber;
    if (reynoldsNumber < 2300) {
        frictionFactor = laminarFrictionFactor;
        flowRegime = 'Laminar rectangular duct';
    }
    else if (reynoldsNumber > 4000) {
        frictionFactor = 0.3164 / reynoldsNumber ** 0.25;
        flowRegime = 'Turbulent, smooth-channel estimate';
    }
    else {
        const fraction = (reynoldsNumber - 2300) / 1700;
        frictionFactor = (laminarFrictionFactor * (1 - fraction)) + ((0.3164 / reynoldsNumber ** 0.25) * fraction);
        flowRegime = 'Transitional, uncertain';
    }
    const pressureDropPa = frictionFactor * (input.channelLengthM / hydraulicDiameterM) * (input.densityKgM3 * channelVelocityMS ** 2 / 2);
    const massFlowKgS = input.densityKgM3 * totalVolumetricFlowM3S;
    const coolantRiseC = input.heatLoadW / (massFlowKgS * input.specificHeatJKgK);

    return {
        coolantRiseC,
        coolantOutletC: input.inletTemperatureC + coolantRiseC,
        pressureDropPa,
        pumpPowerW: pressureDropPa * totalVolumetricFlowM3S,
        reynoldsNumber,
        hydraulicDiameterM,
        channelVelocityMS,
        flowRegime,
    };
}

export function calculateBatteryCoolingScreening(input) {
    const normalized = validateInput(input);
    const result = evaluateFlow(normalized, normalized.flowRateLMin);
    const marginC = normalized.maxOutletTemperatureC - result.coolantOutletC;
    const status = marginC < 0
        ? 'Exceeds coolant outlet limit'
        : result.flowRegime.includes('Transitional')
            ? 'Within limit; transitional flow needs validation'
            : marginC < 3
                ? 'Near coolant outlet limit'
                : 'Within coolant outlet target';

    return {
        inputs: normalized,
        outputs: {
            coolantOutletC: rounded(result.coolantOutletC, 1),
            coolantRiseC: rounded(result.coolantRiseC, 2),
            pressureDropKPa: rounded(result.pressureDropPa / 1000, 3),
            pumpPowerW: rounded(result.pumpPowerW, 3),
            reynoldsNumber: rounded(result.reynoldsNumber, 0),
            hydraulicDiameterMm: rounded(result.hydraulicDiameterM * 1000, 2),
            channelVelocityMS: rounded(result.channelVelocityMS, 3),
            flowRegime: result.flowRegime,
            marginC: rounded(marginC, 1),
            status,
        },
        sweep: [0.5, 1, 2].map((factor) => {
            const flowRate = normalized.flowRateLMin * factor;
            const point = evaluateFlow(normalized, flowRate);
            return {
                label: `${factor}x flow`,
                flowRateLMin: rounded(flowRate, 2),
                coolantOutletC: rounded(point.coolantOutletC, 1),
                pressureDropKPa: rounded(point.pressureDropPa / 1000, 3),
            };
        }),
        assumptions: [
            'Coolant temperature rise follows the steady energy balance Q = mass_flow * Cp * delta_T.',
            'Pressure drop uses Darcy-Weisbach in identical rectangular parallel channels with hydraulic diameter.',
            'Laminar friction uses a rectangular-duct aspect-ratio Poiseuille correlation; turbulent screening uses the smooth-duct Blasius approximation; transition is uncertain.',
            'Reported temperature is bulk coolant outlet temperature, not cell or cold-plate wall temperature; manifolds and local losses are excluded.',
        ],
    };
}

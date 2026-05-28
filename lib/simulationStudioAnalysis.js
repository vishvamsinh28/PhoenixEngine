export const SIMULATION_STUDIO_PROJECT_ID = 'simulation-studio-3d';

const ELECTRONICS_RULES = {
    boardLengthMm: { label: 'Board length', min: 40, max: 800 },
    boardWidthMm: { label: 'Board width', min: 30, max: 600 },
    enclosureHeightMm: { label: 'Enclosure height', min: 20, max: 300 },
    heatLoadW: { label: 'Heat load', min: 1, max: 2000 },
    componentAreaCm2: { label: 'Hot component footprint', min: 1, max: 800 },
    componentHeightMm: { label: 'Component height', min: 1, max: 80 },
    airflowCFM: { label: 'Airflow', min: 0, max: 300 },
    ambientC: { label: 'Ambient temperature', min: -40, max: 90 },
    maxTemperatureC: { label: 'Maximum component temperature', min: 0, max: 200 },
    boardConductivityWmK: { label: 'Board effective conductivity', min: 0.1, max: 400 },
    heatSinkAreaCm2: { label: 'Heat sink area', min: 0, max: 2000 },
};

const BATTERY_RULES = {
    packLengthMm: { label: 'Pack length', min: 100, max: 2500 },
    packWidthMm: { label: 'Pack width', min: 60, max: 1600 },
    moduleCount: { label: 'Module count', min: 1, max: 24 },
    heatLoadW: { label: 'Pack heat load', min: 10, max: 20000 },
    flowRateLMin: { label: 'Coolant flow rate', min: 0.1, max: 80 },
    inletTemperatureC: { label: 'Coolant inlet temperature', min: -20, max: 80 },
    maxCellTemperatureC: { label: 'Maximum cell temperature', min: 0, max: 90 },
    channelLengthM: { label: 'Channel length', min: 0.05, max: 10 },
    channelWidthMm: { label: 'Channel width', min: 1, max: 60 },
    channelHeightMm: { label: 'Channel height', min: 0.5, max: 20 },
    parallelChannels: { label: 'Parallel channel count', min: 1, max: 120 },
    plateConductivityWmK: { label: 'Cold plate conductivity', min: 1, max: 420 },
    cellToCoolantResistanceKW: { label: 'Lumped cell-to-coolant resistance', min: 0, max: 1 },
};

const AERODYNAMICS_RULES = {
    velocityMS: { label: 'Freestream velocity', min: 0.1, max: 120 },
    densityKgM3: { label: 'Fluid density', min: 0.01, max: 50 },
    viscosityPaS: { label: 'Dynamic viscosity', min: 0.000001, max: 1 },
    referenceAreaM2: { label: 'Reference area', min: 0.001, max: 10000 },
    characteristicLengthM: { label: 'Characteristic length', min: 0.001, max: 1000 },
    dragCoefficient: { label: 'Drag coefficient', min: 0, max: 20 },
    liftCoefficient: { label: 'Lift coefficient', min: -20, max: 20 },
    dragLimitN: { label: 'Drag limit', min: 0, max: 1000000000 },
};

const PROCESS_RULES = {
    waferDiameterMm: { label: 'Wafer diameter', min: 50, max: 450 },
    centerRateNmMin: { label: 'Center deposition rate', min: 0.01, max: 1000 },
    centerTemperatureC: { label: 'Center temperature', min: 20, max: 1200 },
    edgeTemperatureC: { label: 'Edge temperature', min: 20, max: 1200 },
    activationEnergyKJMol: { label: 'Activation energy', min: 0, max: 300 },
    processTimeMin: { label: 'Process time', min: 0.1, max: 600 },
    targetThicknessNm: { label: 'Target thickness', min: 1, max: 100000 },
    maxNonuniformityPercent: { label: 'Uniformity limit', min: 0.01, max: 100 },
};

const MATERIALS = {
    fr4: { label: 'FR4 board', spreadingFactor: 1, baseResistanceKW: 1.45 },
    aluminumCore: { label: 'Aluminum-core PCB', spreadingFactor: 0.72, baseResistanceKW: 1.05 },
    copperSlug: { label: 'Copper slug + PCB', spreadingFactor: 0.55, baseResistanceKW: 0.78 },
};

const COOLANTS = {
    water: { label: 'Water', densityKgM3: 997, specificHeatJKgK: 4180, viscosityPaS: 0.00089 },
    glycol30: { label: '30% glycol/water', densityKgM3: 1035, specificHeatJKgK: 3760, viscosityPaS: 0.0021 },
    dielectric: { label: 'Dielectric oil', densityKgM3: 820, specificHeatJKgK: 1900, viscosityPaS: 0.0065 },
};

const AERO_SHAPES = {
    wing: { label: 'Wing section' },
    bluffBody: { label: 'Bluff body' },
    duct: { label: 'Duct / inlet' },
};

const PROCESS_SHAPES = {
    wafer: { label: 'Wafer field' },
    showerhead: { label: 'Showerhead chamber' },
    plasma: { label: 'Plasma zone' },
};

export const SIMULATION_MATERIAL_OPTIONS = Object.entries(MATERIALS).map(([value, material]) => ({
    value,
    label: material.label,
}));

export const SIMULATION_COOLANT_OPTIONS = Object.entries(COOLANTS).map(([value, coolant]) => ({
    value,
    label: coolant.label,
}));

export const SIMULATION_AERO_SHAPE_OPTIONS = Object.entries(AERO_SHAPES).map(([value, shape]) => ({
    value,
    label: shape.label,
}));

export const SIMULATION_PROCESS_SHAPE_OPTIONS = Object.entries(PROCESS_SHAPES).map(([value, shape]) => ({
    value,
    label: shape.label,
}));

function rounded(value, decimals = 2) {
    return Number(value.toFixed(decimals));
}

function validateNumber(input, name, rule) {
    const value = Number(input[name]);
    if (!Number.isFinite(value) || value < rule.min || value > rule.max)
        throw new Error(`${rule.label} must be between ${rule.min} and ${rule.max}.`);
    return value;
}

function validateInput(input, rules) {
    return Object.fromEntries(Object.entries(rules).map(([name, rule]) => [
        name,
        validateNumber(input, name, rule),
    ]));
}

function convectionCoefficient(airflowCFM, boardAreaM2, enclosureHeightMm) {
    const heightPenalty = enclosureHeightMm < 45 ? 0.84 : enclosureHeightMm > 120 ? 1.08 : 1;
    const flowPerArea = airflowCFM / Math.max(boardAreaM2 * 10.764, 0.1);
    return (5 + 4.8 * Math.sqrt(Math.max(flowPerArea, 0))) * heightPenalty;
}

function calculateElectronicsAtAirflow(input, airflowCFM) {
    const material = MATERIALS[input.materialKey];
    const boardAreaM2 = (input.boardLengthMm / 1000) * (input.boardWidthMm / 1000);
    const componentAreaM2 = input.componentAreaCm2 / 10000;
    const heatSinkAreaM2 = input.heatSinkAreaCm2 / 10000;
    const effectiveAreaM2 = Math.max(componentAreaM2 * 1.8 + heatSinkAreaM2, componentAreaM2);
    const h = convectionCoefficient(airflowCFM, boardAreaM2, input.enclosureHeightMm);
    const convectionResistanceKW = 1 / Math.max(h * effectiveAreaM2, 0.001);
    const spreadingResistanceKW = material.baseResistanceKW * material.spreadingFactor * Math.sqrt(componentAreaM2 / Math.max(boardAreaM2, componentAreaM2));
    const conductionResistanceKW = (0.0016 / (input.boardConductivityWmK * Math.max(componentAreaM2, 0.0001))) * material.spreadingFactor;
    const totalResistanceKW = convectionResistanceKW + spreadingResistanceKW + conductionResistanceKW;
    const temperatureRiseC = input.heatLoadW * totalResistanceKW;
    const predictedHotspotC = input.ambientC + temperatureRiseC;
    const marginC = input.maxTemperatureC - predictedHotspotC;

    return {
        h,
        totalResistanceKW,
        predictedHotspotC,
        temperatureRiseC,
        marginC,
        heatFluxWcm2: input.heatLoadW / input.componentAreaCm2,
        pressureProxyPa: rounded(0.42 * airflowCFM ** 1.85 / Math.max(input.enclosureHeightMm / 60, 0.4), 1),
    };
}

function calculateElectronicsRun(input) {
    const normalized = {
        ...validateInput(input, ELECTRONICS_RULES),
        moduleType: 'electronics',
        materialKey: MATERIALS[input.materialKey] ? input.materialKey : 'fr4',
    };
    const result = calculateElectronicsAtAirflow(normalized, normalized.airflowCFM);
    const status = result.marginC < 0
        ? 'Hotspot exceeds temperature limit'
        : result.marginC < 8
            ? 'Thermal margin is narrow'
            : 'Concept design is within thermal target';

    return {
        inputs: normalized,
        outputs: {
            primaryValue: rounded(result.predictedHotspotC, 1),
            primaryLabel: 'Hotspot',
            predictedHotspotC: rounded(result.predictedHotspotC, 1),
            temperatureRiseC: rounded(result.temperatureRiseC, 1),
            totalResistanceKW: rounded(result.totalResistanceKW, 3),
            convectionCoefficientWm2K: rounded(result.h, 1),
            marginC: rounded(result.marginC, 1),
            heatFluxWcm2: rounded(result.heatFluxWcm2, 2),
            pressureProxyPa: result.pressureProxyPa,
            status,
        },
        sweep: [0.5, 0.75, 1, 1.25, 1.5].map((factor) => {
            const airflowCFM = rounded(normalized.airflowCFM * factor, 1);
            const point = calculateElectronicsAtAirflow(normalized, airflowCFM);
            return {
                label: `${factor}x airflow`,
                airflowCFM,
                predictedHotspotC: rounded(point.predictedHotspotC, 1),
                marginC: rounded(point.marginC, 1),
                pressureProxyPa: point.pressureProxyPa,
            };
        }),
        assumptions: [
            'This is a reduced-order electronics enclosure model for concept screening.',
            'The 3D scene is a geometry and result visualization, not a CFD or FEA mesh solve.',
            'Airflow is converted into an approximate convection coefficient using enclosure-scale assumptions.',
            'Thermal spreading is represented by a compact resistance estimate based on selected construction.',
            'Pressure is a fan-load proxy for concept comparison, not a duct-resolved pressure drop.',
        ],
    };
}

function hydraulicDiameter(widthM, heightM) {
    return (2 * widthM * heightM) / (widthM + heightM);
}

function frictionFactor(reynoldsNumber) {
    if (reynoldsNumber < 2300)
        return 64 / Math.max(reynoldsNumber, 1);
    return 0.3164 / Math.pow(reynoldsNumber, 0.25);
}

function calculateBatteryAtFlow(input, flowRateLMin) {
    const coolant = COOLANTS[input.coolantKey];
    const totalFlowM3S = flowRateLMin / 1000 / 60;
    const massFlowKgS = totalFlowM3S * coolant.densityKgM3;
    const coolantRiseC = input.heatLoadW / Math.max(massFlowKgS * coolant.specificHeatJKgK, 0.0001);
    const coolantOutletC = input.inletTemperatureC + coolantRiseC;
    const widthM = input.channelWidthMm / 1000;
    const heightM = input.channelHeightMm / 1000;
    const areaM2 = widthM * heightM;
    const perChannelFlowM3S = totalFlowM3S / input.parallelChannels;
    const velocityMS = perChannelFlowM3S / Math.max(areaM2, 0.0000001);
    const diameterM = hydraulicDiameter(widthM, heightM);
    const reynoldsNumber = (coolant.densityKgM3 * velocityMS * diameterM) / coolant.viscosityPaS;
    const pressureDropPa = frictionFactor(reynoldsNumber) * (input.channelLengthM / diameterM) * (coolant.densityKgM3 * velocityMS ** 2 / 2);
    const plateResistanceKW = 0.004 / Math.max(input.plateConductivityWmK * input.packLengthMm * input.packWidthMm / 1000000, 0.001);
    const contactRiseC = input.heatLoadW * (input.cellToCoolantResistanceKW + plateResistanceKW);
    const estimatedCellMaxC = coolantOutletC + contactRiseC;
    const marginC = input.maxCellTemperatureC - estimatedCellMaxC;

    return {
        coolantRiseC,
        coolantOutletC,
        estimatedCellMaxC,
        marginC,
        pressureDropKPa: pressureDropPa / 1000,
        reynoldsNumber,
        velocityMS,
    };
}

function calculateBatteryRun(input) {
    const normalizedBase = validateInput(input, BATTERY_RULES);
    if (normalizedBase.moduleCount !== Math.round(normalizedBase.moduleCount))
        throw new Error('Module count must be a whole number.');
    if (normalizedBase.parallelChannels !== Math.round(normalizedBase.parallelChannels))
        throw new Error('Parallel channel count must be a whole number.');

    const normalized = {
        ...normalizedBase,
        moduleType: 'battery',
        coolantKey: COOLANTS[input.coolantKey] ? input.coolantKey : 'glycol30',
    };
    const result = calculateBatteryAtFlow(normalized, normalized.flowRateLMin);
    const status = result.marginC < 0
        ? 'Estimated cell temperature exceeds limit'
        : result.marginC < 4
            ? 'Cooling margin is narrow'
            : 'Battery cooling concept is within target';

    return {
        inputs: normalized,
        outputs: {
            primaryValue: rounded(result.estimatedCellMaxC, 1),
            primaryLabel: 'Cell max',
            estimatedCellMaxC: rounded(result.estimatedCellMaxC, 1),
            coolantOutletC: rounded(result.coolantOutletC, 1),
            coolantRiseC: rounded(result.coolantRiseC, 1),
            pressureDropKPa: rounded(result.pressureDropKPa, 2),
            reynoldsNumber: rounded(result.reynoldsNumber, 0),
            channelVelocityMS: rounded(result.velocityMS, 2),
            cellToCoolantRiseC: rounded(result.estimatedCellMaxC - result.coolantOutletC, 1),
            marginC: rounded(result.marginC, 1),
            status,
        },
        sweep: [0.5, 0.75, 1, 1.25, 1.5].map((factor) => {
            const flowRateLMin = rounded(normalized.flowRateLMin * factor, 1);
            const point = calculateBatteryAtFlow(normalized, flowRateLMin);
            return {
                label: `${factor}x flow`,
                flowRateLMin,
                estimatedCellMaxC: rounded(point.estimatedCellMaxC, 1),
                coolantOutletC: rounded(point.coolantOutletC, 1),
                pressureDropKPa: rounded(point.pressureDropKPa, 2),
                marginC: rounded(point.marginC, 1),
            };
        }),
        assumptions: [
            'This is a reduced-order battery cold-plate concept model for early layout screening.',
            'The 3D scene shows module, plate, and coolant-path geometry; it is not a resolved CFD mesh.',
            'Coolant temperature uses a bulk energy balance and rectangular-channel pressure-drop estimate.',
            'Cell maximum temperature uses the supplied lumped cell-to-coolant resistance plus a simple plate conduction estimate.',
            'Manifold imbalance, two-phase effects, aging, and transient drive cycles are not modeled.',
        ],
    };
}

function calculateAeroAtVelocity(input, velocityMS) {
    const dynamicPressurePa = 0.5 * input.densityKgM3 * velocityMS ** 2;
    const effectiveCd = input.dragCoefficient;
    const effectiveCl = input.liftCoefficient;
    const dragN = dynamicPressurePa * input.referenceAreaM2 * effectiveCd;
    const liftN = dynamicPressurePa * input.referenceAreaM2 * effectiveCl;
    const reynoldsNumber = (input.densityKgM3 * velocityMS * input.characteristicLengthM) / input.viscosityPaS;

    return {
        dynamicPressurePa,
        effectiveCd,
        effectiveCl,
        dragN,
        liftN,
        reynoldsNumber,
        dragMarginN: input.dragLimitN - dragN,
    };
}

function calculateAerodynamicsRun(input) {
    const normalized = {
        ...validateInput(input, AERODYNAMICS_RULES),
        moduleType: 'aerodynamics',
        shapeKey: AERO_SHAPES[input.shapeKey] ? input.shapeKey : 'wing',
    };
    const result = calculateAeroAtVelocity(normalized, normalized.velocityMS);
    const status = result.dragMarginN < 0
        ? 'Drag exceeds force limit'
        : result.dragMarginN < normalized.dragLimitN * 0.1
            ? 'Drag margin is narrow'
            : 'Aerodynamic concept is within drag target';

    return {
        inputs: normalized,
        outputs: {
            primaryValue: rounded(result.dragN, 1),
            primaryLabel: 'Drag',
            dragN: rounded(result.dragN, 2),
            liftN: rounded(result.liftN, 2),
            dragMarginN: rounded(result.dragMarginN, 2),
            dynamicPressurePa: rounded(result.dynamicPressurePa, 1),
            reynoldsNumber: rounded(result.reynoldsNumber, 0),
            effectiveCd: rounded(result.effectiveCd, 3),
            effectiveCl: rounded(result.effectiveCl, 3),
            marginC: rounded(result.dragMarginN, 1),
            status,
        },
        sweep: [0.5, 0.75, 1, 1.25, 1.5].map((factor) => {
            const velocityMS = rounded(normalized.velocityMS * factor, 1);
            const point = calculateAeroAtVelocity(normalized, velocityMS);
            return {
                label: `${factor}x velocity`,
                velocityMS,
                dragN: rounded(point.dragN, 2),
                liftN: rounded(point.liftN, 2),
                dragMarginN: rounded(point.dragMarginN, 2),
                marginC: rounded(point.dragMarginN, 1),
            };
        }),
        assumptions: [
            'This is a 3D concept visualization of coefficient-based external-flow screening.',
            'Lift and drag coefficients are user-supplied inputs; the geometry selector changes visualization only.',
            'Forces use q = 0.5 rho V^2, D = q A Cd, L = q A Cl, and Re = rho V L / mu.',
            'Compressibility, stall, separation, induced drag, and detailed geometry effects are not resolved.',
        ],
    };
}

function calculateProcessAtEdgeTemp(input, edgeTemperatureC) {
    const gasConstant = 8.314;
    const centerK = input.centerTemperatureC + 273.15;
    const edgeK = edgeTemperatureC + 273.15;
    const activationJMol = input.activationEnergyKJMol * 1000;
    const edgeRateNmMin = input.centerRateNmMin * Math.exp((-activationJMol / gasConstant) * ((1 / edgeK) - (1 / centerK)));
    const centerThicknessNm = input.centerRateNmMin * input.processTimeMin;
    const edgeThicknessNm = edgeRateNmMin * input.processTimeMin;
    const meanThicknessNm = (centerThicknessNm + edgeThicknessNm) / 2;
    const nonuniformityPercent = Math.abs(centerThicknessNm - edgeThicknessNm) / Math.max(meanThicknessNm, 0.0001) * 100;

    return {
        edgeRateNmMin,
        centerThicknessNm,
        edgeThicknessNm,
        meanThicknessNm,
        nonuniformityPercent,
        thicknessErrorNm: meanThicknessNm - input.targetThicknessNm,
        uniformityMarginPercent: input.maxNonuniformityPercent - nonuniformityPercent,
    };
}

function calculateProcessRun(input) {
    const normalized = {
        ...validateInput(input, PROCESS_RULES),
        moduleType: 'process',
        shapeKey: PROCESS_SHAPES[input.shapeKey] ? input.shapeKey : 'wafer',
    };
    const result = calculateProcessAtEdgeTemp(normalized, normalized.edgeTemperatureC);
    const status = result.uniformityMarginPercent < 0
        ? 'Uniformity exceeds process limit'
        : result.uniformityMarginPercent < 1
            ? 'Uniformity margin is narrow'
            : 'Process concept is within uniformity target';

    return {
        inputs: normalized,
        outputs: {
            primaryValue: rounded(result.nonuniformityPercent, 2),
            primaryLabel: 'Nonuniformity',
            meanThicknessNm: rounded(result.meanThicknessNm, 2),
            edgeThicknessNm: rounded(result.edgeThicknessNm, 2),
            centerThicknessNm: rounded(result.centerThicknessNm, 2),
            nonuniformityPercent: rounded(result.nonuniformityPercent, 2),
            uniformityMarginPercent: rounded(result.uniformityMarginPercent, 2),
            thicknessErrorNm: rounded(result.thicknessErrorNm, 2),
            marginC: rounded(result.uniformityMarginPercent, 2),
            status,
        },
        sweep: [-8, -4, 0, 4, 8].map((offset) => {
            const edgeTemperatureC = rounded(normalized.edgeTemperatureC + offset, 1);
            const point = calculateProcessAtEdgeTemp(normalized, edgeTemperatureC);
            return {
                label: `${offset >= 0 ? '+' : ''}${offset} C edge`,
                edgeTemperatureC,
                nonuniformityPercent: rounded(point.nonuniformityPercent, 2),
                meanThicknessNm: rounded(point.meanThicknessNm, 2),
                uniformityMarginPercent: rounded(point.uniformityMarginPercent, 2),
                marginC: rounded(point.uniformityMarginPercent, 2),
            };
        }),
        assumptions: [
            'This is a reduced-order wafer/process visualization for early uniformity screening.',
            'Rate sensitivity uses a two-point Arrhenius estimate between center and edge temperatures.',
            'The field model selector changes visualization only; it does not alter calculated nonuniformity.',
            'Gas-phase transport, plasma chemistry, loading effects, and full radial field calibration are not modeled.',
        ],
    };
}

export function calculateSimulationStudioRun(input) {
    if (input.moduleType === 'battery')
        return calculateBatteryRun(input);
    if (input.moduleType === 'aerodynamics')
        return calculateAerodynamicsRun(input);
    if (input.moduleType === 'process')
        return calculateProcessRun(input);
    return calculateElectronicsRun(input);
}

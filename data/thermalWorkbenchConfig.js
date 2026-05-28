export const THERMAL_DEFAULT_INPUTS = {
    powerW: '75',
    effectiveAreaCm2: '250',
    pathThicknessMm: '2',
    conductivityWmK: '205',
    contactResistanceKW: '0.15',
    heatTransferCoefficient: '45',
    ambientC: '25',
    maxTemperatureC: '90',
};

export const THERMAL_INPUT_FIELDS = [
    { name: 'powerW', label: 'Heat load', unit: 'W' },
    { name: 'effectiveAreaCm2', label: 'Effective area', unit: 'cm2' },
    { name: 'pathThicknessMm', label: 'Path thickness', unit: 'mm' },
    { name: 'conductivityWmK', label: 'Conductivity', unit: 'W/mK' },
    { name: 'contactResistanceKW', label: 'Interface R', unit: 'K/W' },
    { name: 'heatTransferCoefficient', label: 'Convection h', unit: 'W/m2K' },
    { name: 'ambientC', label: 'Ambient', unit: 'C' },
    { name: 'maxTemperatureC', label: 'Max temperature', unit: 'C' },
];

export function buildThermalDiscussionPrompt(run) {
    return [
        'Interpret this saved deterministic thermal screening run and recommend the next design change or measurement.',
        `Inputs: heat load ${run.inputs.powerW} W; effective area ${run.inputs.effectiveAreaCm2} cm2; path thickness ${run.inputs.pathThicknessMm} mm; conductivity ${run.inputs.conductivityWmK} W/mK; interface resistance ${run.inputs.contactResistanceKW} K/W; h ${run.inputs.heatTransferCoefficient} W/m2K; ambient ${run.inputs.ambientC} C; limit ${run.inputs.maxTemperatureC} C.`,
        `Calculated result: total thermal resistance ${run.outputs.totalResistanceKW} K/W; predicted temperature ${run.outputs.predictedTemperatureC} C; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
        'Treat this as a preliminary analytical resistance-network estimate, not validated CFD or FEA.',
    ].join('\n');
}

export function getThermalValidationNotes(inputs) {
    const notes = [];
    const power = Number(inputs.powerW);
    const area = Number(inputs.effectiveAreaCm2);
    const h = Number(inputs.heatTransferCoefficient);
    const ambient = Number(inputs.ambientC);
    const limit = Number(inputs.maxTemperatureC);

    if (Number.isFinite(power) && Number.isFinite(area) && area > 0 && power / area > 5)
        notes.push('Heat load per area is high; verify the effective cooling area and spreading assumption.');
    if (Number.isFinite(h) && h < 10)
        notes.push('Convection coefficient is very low; natural-convection or sealed-enclosure assumptions should be explicit.');
    if (Number.isFinite(ambient) && Number.isFinite(limit) && limit <= ambient)
        notes.push('Temperature limit is not above ambient, so the run will likely fail by definition.');
    return notes;
}

export const THERMAL_METRICS = [
    { label: 'Predicted temp', read: (run) => `${run.outputs.predictedTemperatureC} C` },
    { label: 'Thermal R', read: (run) => `${run.outputs.totalResistanceKW} K/W` },
    { label: 'Temperature rise', read: (run) => `${run.outputs.temperatureRiseC} C` },
    { label: 'Margin', read: (run) => `${run.outputs.marginC} C` },
];

export const THERMAL_TRANSPARENCY = [
    'Inputs are validated numerically before the deterministic screening model runs.',
    'Temperature, resistance, and sweep values come from a resistance-network calculation, not from the AI chat model.',
    'The AI chat is used only when you ask to discuss a saved run or interpret next steps.',
    'Report export captures the exact saved inputs, outputs, assumptions, sweep, and transparency notes visible here.',
];

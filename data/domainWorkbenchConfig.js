import { Droplets, Layers3, Wind } from 'lucide-react';

export const DOMAIN_WORKBENCHES = {
    'winglet-flow': {
        endpoint: '/api/aerodynamics-runs',
        title: 'External Flow Force Screening',
        subtitle: 'Coefficient-based lift, drag and Reynolds checks',
        Icon: Wind,
        inputs: [
            { name: 'velocityMS', label: 'Velocity', unit: 'm/s', value: '30' },
            { name: 'densityKgM3', label: 'Density', unit: 'kg/m3', value: '1.225' },
            { name: 'viscosityPaS', label: 'Viscosity', unit: 'Pa s', value: '0.0000181' },
            { name: 'referenceAreaM2', label: 'Reference area', unit: 'm2', value: '0.45' },
            { name: 'characteristicLengthM', label: 'Length scale', unit: 'm', value: '0.8' },
            { name: 'dragCoefficient', label: 'Drag coefficient', unit: 'Cd', value: '0.32' },
            { name: 'liftCoefficient', label: 'Lift coefficient', unit: 'Cl', value: '0.1' },
            { name: 'dragLimitN', label: 'Drag limit', unit: 'N', value: '100' },
        ],
        footer: 'Requires supplied Cd and Cl; Phoenix does not predict geometry coefficients.',
        metrics: [
            { label: 'Drag', read: (run) => `${run.outputs.dragN} N` },
            { label: 'Lift', read: (run) => `${run.outputs.liftN} N` },
            { label: 'Dynamic pressure', read: (run) => `${run.outputs.dynamicPressurePa} Pa` },
            { label: 'Reynolds number', read: (run) => run.outputs.reynoldsNumber.toLocaleString() },
        ],
        summary: (run) => `${run.outputs.dragN} N drag / ${run.outputs.dragMarginN} N margin`,
        margin: (run) => run.outputs.dragMarginN,
        warningThreshold: (run) => run.inputs.dragLimitN * 0.1,
        validation: (inputs) => {
            const notes = [];
            if (Number(inputs.velocityMS) > 70)
                notes.push('Velocity is high for this incompressible screening model; check Mach number before trusting margins.');
            if (Number(inputs.dragCoefficient) === 0)
                notes.push('Zero drag coefficient is only valid for an idealized placeholder or calibration check.');
            return notes;
        },
        chart: {
            title: 'Velocity sensitivity',
            points: (run) => run.sweep.map((point) => ({
                label: `${point.label} (${point.velocityMS} m/s)`,
                value: point.dragN,
                display: `${point.dragN} N`,
            })),
        },
        transparency: [
            'Drag and lift are deterministic force calculations from supplied coefficients.',
            'Phoenix does not infer Cd or Cl from geometry in this workbench.',
            'The AI chat is used only to interpret saved results and recommend validation work.',
            'Report export includes the saved inputs, outputs, sweep, assumptions, and transparency notes.',
        ],
        discussion: (run) => [
            'Interpret this saved external-flow force screening run and identify what CFD or wind-tunnel evidence is needed next.',
            `Inputs: velocity ${run.inputs.velocityMS} m/s; density ${run.inputs.densityKgM3} kg/m3; viscosity ${run.inputs.viscosityPaS} Pa s; reference area ${run.inputs.referenceAreaM2} m2; length scale ${run.inputs.characteristicLengthM} m; supplied Cd ${run.inputs.dragCoefficient}; supplied Cl ${run.inputs.liftCoefficient}.`,
            `Calculated result: Re ${run.outputs.reynoldsNumber}; dynamic pressure ${run.outputs.dynamicPressurePa} Pa; drag ${run.outputs.dragN} N; lift ${run.outputs.liftN} N; drag margin ${run.outputs.dragMarginN} N.`,
            'Cd and Cl were supplied inputs, not predictions. Treat this as an incompressible analytical force estimate, not CFD.',
        ].join('\n'),
    },
    'battery-coldplate': {
        endpoint: '/api/battery-runs',
        title: 'Liquid Loop Screening',
        subtitle: 'Coolant energy balance and channel pressure drop',
        Icon: Droplets,
        inputs: [
            { name: 'heatLoadW', label: 'Heat load', unit: 'W', value: '1200' },
            { name: 'flowRateLMin', label: 'Total flow', unit: 'L/min', value: '6' },
            { name: 'inletTemperatureC', label: 'Inlet temp', unit: 'C', value: '25' },
            { name: 'maxOutletTemperatureC', label: 'Outlet limit', unit: 'C', value: '35' },
            { name: 'densityKgM3', label: 'Coolant density', unit: 'kg/m3', value: '997' },
            { name: 'specificHeatJKgK', label: 'Coolant Cp', unit: 'J/kgK', value: '4180' },
            { name: 'viscosityPaS', label: 'Viscosity', unit: 'Pa s', value: '0.00089' },
            { name: 'channelLengthM', label: 'Channel length', unit: 'm', value: '0.45' },
            { name: 'channelWidthMm', label: 'Channel width', unit: 'mm', value: '8' },
            { name: 'channelHeightMm', label: 'Channel height', unit: 'mm', value: '3' },
            { name: 'parallelChannels', label: 'Parallel channels', unit: 'count', value: '10' },
        ],
        footer: 'Reports bulk coolant outlet temperature, not maximum cell temperature.',
        metrics: [
            { label: 'Coolant outlet', read: (run) => `${run.outputs.coolantOutletC} C` },
            { label: 'Pressure drop', read: (run) => `${run.outputs.pressureDropKPa} kPa` },
            { label: 'Reynolds number', read: (run) => run.outputs.reynoldsNumber.toLocaleString() },
            { label: 'Margin to outlet limit', read: (run) => `${run.outputs.marginC} C` },
        ],
        summary: (run) => `${run.outputs.coolantOutletC} C outlet / ${run.outputs.pressureDropKPa} kPa`,
        margin: (run) => run.outputs.marginC,
        warningThreshold: () => 3,
        validation: (inputs) => {
            const notes = [];
            if (Number(inputs.parallelChannels) !== Math.round(Number(inputs.parallelChannels)))
                notes.push('Parallel channel count must be a whole number.');
            if (Number(inputs.flowRateLMin) > 20)
                notes.push('High flow can produce large pressure drop; confirm pump capability and manifold losses separately.');
            return notes;
        },
        chart: {
            title: 'Flow-rate sensitivity',
            points: (run) => run.sweep.map((point) => ({
                label: `${point.label} (${point.flowRateLMin} L/min)`,
                value: point.pressureDropKPa,
                display: `${point.coolantOutletC} C / ${point.pressureDropKPa} kPa`,
            })),
        },
        transparency: [
            'Coolant outlet temperature and pressure drop come from deterministic energy-balance and Darcy-Weisbach calculations.',
            'The reported temperature is bulk coolant outlet temperature, not cell maximum temperature.',
            'The AI chat is used only when asked to interpret a saved run or recommend next validation.',
            'Report export captures the exact saved inputs, outputs, sweep, assumptions, and transparency notes.',
        ],
        discussion: (run) => [
            'Interpret this saved liquid cooling screening run and recommend the next cold-plate or flow-loop validation step.',
            `Inputs: heat load ${run.inputs.heatLoadW} W; flow ${run.inputs.flowRateLMin} L/min; inlet ${run.inputs.inletTemperatureC} C; outlet limit ${run.inputs.maxOutletTemperatureC} C; ${run.inputs.parallelChannels} channels of ${run.inputs.channelWidthMm} by ${run.inputs.channelHeightMm} mm and ${run.inputs.channelLengthM} m length.`,
            `Calculated result: coolant outlet ${run.outputs.coolantOutletC} C; rise ${run.outputs.coolantRiseC} C; channel pressure drop ${run.outputs.pressureDropKPa} kPa; Re ${run.outputs.reynoldsNumber}; regime ${run.outputs.flowRegime}.`,
            'This calculates bulk coolant temperature and straight-channel Darcy-Weisbach loss only; it does not calculate cell maximum temperature or manifold losses.',
        ].join('\n'),
    },
    'wafer-deposition': {
        endpoint: '/api/process-runs',
        title: 'Deposition Uniformity Screening',
        subtitle: 'Reaction-limited Arrhenius temperature sensitivity',
        Icon: Layers3,
        inputs: [
            { name: 'centerRateNmMin', label: 'Center rate', unit: 'nm/min', value: '10' },
            { name: 'centerTemperatureC', label: 'Center temp', unit: 'C', value: '400' },
            { name: 'edgeTemperatureC', label: 'Edge temp', unit: 'C', value: '395' },
            { name: 'activationEnergyKJMol', label: 'Activation energy', unit: 'kJ/mol', value: '45' },
            { name: 'processTimeMin', label: 'Process time', unit: 'min', value: '10' },
            { name: 'targetThicknessNm', label: 'Target thickness', unit: 'nm', value: '100' },
            { name: 'maxNonuniformityPercent', label: 'Uniformity limit', unit: '%', value: '5' },
        ],
        footer: 'Valid only when surface reaction kinetics dominate transport effects.',
        metrics: [
            { label: 'Mean thickness', read: (run) => `${run.outputs.meanThicknessNm} nm` },
            { label: 'Edge thickness', read: (run) => `${run.outputs.edgeThicknessNm} nm` },
            { label: 'Non-uniformity', read: (run) => `${run.outputs.nonuniformityPercent}%` },
            { label: 'Uniformity margin', read: (run) => `${run.outputs.nonuniformityMarginPercent}%` },
        ],
        summary: (run) => `${run.outputs.meanThicknessNm} nm / ${run.outputs.nonuniformityPercent}% non-uniformity`,
        margin: (run) => run.outputs.nonuniformityMarginPercent,
        warningThreshold: () => 1,
        validation: (inputs) => {
            const notes = [];
            if (Math.abs(Number(inputs.centerTemperatureC) - Number(inputs.edgeTemperatureC)) > 20)
                notes.push('Large center-to-edge temperature deltas may exceed the useful range of this two-point model.');
            if (Number(inputs.activationEnergyKJMol) === 0)
                notes.push('Zero activation energy removes temperature sensitivity; use only for a deliberate control case.');
            return notes;
        },
        chart: {
            title: 'Edge temperature sensitivity',
            points: (run) => run.sweep.map((point) => ({
                label: `${point.label} (${point.edgeTemperatureC} C)`,
                value: point.nonuniformityPercent,
                display: `${point.nonuniformityPercent}%`,
            })),
        },
        transparency: [
            'Thickness and uniformity come from a deterministic Arrhenius screening model.',
            'The model uses only center and edge conditions; it does not resolve full radial behavior.',
            'The AI chat is used only to interpret saved runs and suggest process characterization steps.',
            'Report export includes the exact saved inputs, outputs, sweep, assumptions, and transparency notes.',
        ],
        discussion: (run) => [
            'Interpret this saved deposition uniformity screening run and recommend the next process characterization step.',
            `Inputs: center rate ${run.inputs.centerRateNmMin} nm/min at ${run.inputs.centerTemperatureC} C; edge temperature ${run.inputs.edgeTemperatureC} C; activation energy ${run.inputs.activationEnergyKJMol} kJ/mol; duration ${run.inputs.processTimeMin} min; target ${run.inputs.targetThicknessNm} nm; maximum non-uniformity ${run.inputs.maxNonuniformityPercent}%.`,
            `Calculated result: mean thickness ${run.outputs.meanThicknessNm} nm; edge thickness ${run.outputs.edgeThicknessNm} nm; non-uniformity ${run.outputs.nonuniformityPercent}%; margin ${run.outputs.nonuniformityMarginPercent}%.`,
            'This is a reaction-limited Arrhenius screening model and does not model gas-phase transport, chamber flow, plasma, or radial field resolution.',
        ].join('\n'),
    },
};

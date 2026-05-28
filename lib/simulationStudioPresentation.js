import { SIMULATION_MODULES } from '@/data/simulationStudioConfig';
import { formatDate } from '@/lib/dateFormat';

export function getMarginWarningThreshold(run) {
    if (!run)
        return 0;
    if (run.inputs.moduleType === 'battery')
        return 4;
    if (run.inputs.moduleType === 'aerodynamics')
        return run.inputs.dragLimitN * 0.1;
    if (run.inputs.moduleType === 'process')
        return 1;
    return 8;
}

export function getRunMargin(run) {
    if (!run)
        return { value: 0, unit: '' };
    if (run.inputs.moduleType === 'aerodynamics')
        return { value: run.outputs.dragMarginN, unit: 'N' };
    if (run.inputs.moduleType === 'process')
        return { value: run.outputs.uniformityMarginPercent, unit: '%' };
    return { value: run.outputs.marginC, unit: 'C' };
}

export function getSweepPointMargin(run, point) {
    if (run.inputs.moduleType === 'aerodynamics')
        return { value: point.dragMarginN, unit: 'N' };
    if (run.inputs.moduleType === 'process')
        return { value: point.uniformityMarginPercent, unit: '%' };
    return { value: point.marginC, unit: 'C' };
}

export function formatSweepCardValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.estimatedCellMaxC} C cell`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.dragN} N drag`;
    if (run.inputs.moduleType === 'process')
        return `${point.nonuniformityPercent}% nonuniformity`;
    return `${point.predictedHotspotC} C hotspot`;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function buildDiscussionPrompt(run) {
    if (run.inputs.moduleType === 'battery') {
        return [
            'Interpret this Phoenix 3D battery cold-plate concept simulation and recommend practical design improvements.',
            `Geometry: ${run.inputs.moduleCount} modules in a ${run.inputs.packLengthMm} by ${run.inputs.packWidthMm} mm pack; channel ${run.inputs.channelWidthMm} by ${run.inputs.channelHeightMm} mm, ${run.inputs.channelLengthM} m length, ${run.inputs.parallelChannels} parallel paths.`,
            `Boundary conditions: heat load ${run.inputs.heatLoadW} W; flow ${run.inputs.flowRateLMin} L/min; inlet ${run.inputs.inletTemperatureC} C; max cell limit ${run.inputs.maxCellTemperatureC} C.`,
            `Calculated result: estimated cell max ${run.outputs.estimatedCellMaxC} C; coolant outlet ${run.outputs.coolantOutletC} C; pressure drop ${run.outputs.pressureDropKPa} kPa; Re ${run.outputs.reynoldsNumber}; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
            'Treat the 3D scene as a reduced-order visualization and concept screening model, not validated CFD or FEA.',
        ].join('\n');
    }
    if (run.inputs.moduleType === 'aerodynamics') {
        return [
            'Interpret this Phoenix 3D aerodynamics concept simulation and recommend what CFD or test validation should happen next.',
            `Geometry type: ${run.inputs.shapeKey}; velocity ${run.inputs.velocityMS} m/s; reference area ${run.inputs.referenceAreaM2} m2; characteristic length ${run.inputs.characteristicLengthM} m.`,
            `Inputs: density ${run.inputs.densityKgM3} kg/m3; viscosity ${run.inputs.viscosityPaS} Pa s; supplied Cd ${run.inputs.dragCoefficient}; supplied Cl ${run.inputs.liftCoefficient}; drag limit ${run.inputs.dragLimitN} N.`,
            `Calculated result: drag ${run.outputs.dragN} N; lift ${run.outputs.liftN} N; Re ${run.outputs.reynoldsNumber}; dynamic pressure ${run.outputs.dynamicPressurePa} Pa; margin ${run.outputs.dragMarginN} N; status ${run.outputs.status}.`,
            'Treat the 3D scene as a coefficient-based visualization and concept screening model, not CFD.',
        ].join('\n');
    }
    if (run.inputs.moduleType === 'process') {
        return [
            'Interpret this Phoenix 3D process modeling concept simulation and recommend process characterization steps.',
            `Geometry type: ${run.inputs.shapeKey}; wafer diameter ${run.inputs.waferDiameterMm} mm; center rate ${run.inputs.centerRateNmMin} nm/min; center temperature ${run.inputs.centerTemperatureC} C; edge temperature ${run.inputs.edgeTemperatureC} C.`,
            `Inputs: activation energy ${run.inputs.activationEnergyKJMol} kJ/mol; process time ${run.inputs.processTimeMin} min; target thickness ${run.inputs.targetThicknessNm} nm; uniformity limit ${run.inputs.maxNonuniformityPercent}%.`,
            `Calculated result: mean thickness ${run.outputs.meanThicknessNm} nm; nonuniformity ${run.outputs.nonuniformityPercent}%; uniformity margin ${run.outputs.uniformityMarginPercent}%; status ${run.outputs.status}.`,
            'Treat the 3D scene as a radial/process-field visualization, not a chamber CFD or plasma model.',
        ].join('\n');
    }

    return [
        'Interpret this Phoenix 3D electronics enclosure concept simulation and recommend practical design improvements.',
        `Geometry: ${run.inputs.boardLengthMm} by ${run.inputs.boardWidthMm} mm board in a ${run.inputs.enclosureHeightMm} mm tall enclosure; hotspot component area ${run.inputs.componentAreaCm2} cm2 and height ${run.inputs.componentHeightMm} mm.`,
        `Boundary conditions: heat load ${run.inputs.heatLoadW} W; airflow ${run.inputs.airflowCFM} CFM; ambient ${run.inputs.ambientC} C; temperature limit ${run.inputs.maxTemperatureC} C; heat sink area ${run.inputs.heatSinkAreaCm2} cm2.`,
        `Calculated result: hotspot ${run.outputs.predictedHotspotC} C; rise ${run.outputs.temperatureRiseC} C; thermal resistance ${run.outputs.totalResistanceKW} K/W; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
        'Treat the 3D scene as a reduced-order visualization and concept screening model, not validated CFD or FEA.',
    ].join('\n');
}

export function getValidationNotes(inputs, run) {
    const notes = [];
    if (!run)
        return notes;

    if (inputs.moduleType === 'battery') {
        if (run.outputs.pressureDropKPa > 25)
            notes.push('Pressure drop is high for a concept loop; check pump head, manifolds, and channel count.');
        if (run.outputs.reynoldsNumber < 2300)
            notes.push('The channel flow is likely laminar; verify heat-transfer coefficients before trusting cell margins.');
        if (run.outputs.marginC < 4)
            notes.push('Cooling margin is narrow; validate plate contact resistance and worst-case heat generation.');
        return notes;
    }
    if (inputs.moduleType === 'aerodynamics') {
        if (run.outputs.dragMarginN < 0)
            notes.push('Drag exceeds the concept limit; reduce Cd/reference area or revisit operating speed.');
        if (Number(inputs.velocityMS) > 70)
            notes.push('Velocity is high for this incompressible screening model; check Mach number before trusting margins.');
        if (Number(inputs.dragCoefficient) === 0)
            notes.push('Zero drag coefficient is only useful for a deliberate control case.');
        return notes;
    }
    if (inputs.moduleType === 'process') {
        if (run.outputs.uniformityMarginPercent < 1)
            notes.push('Uniformity margin is narrow; characterize center-edge temperature and rate calibration before relying on the result.');
        if (Math.abs(Number(inputs.centerTemperatureC) - Number(inputs.edgeTemperatureC)) > 20)
            notes.push('Large center-edge temperature deltas may exceed the useful range of this two-point model.');
        return notes;
    }

    if (run.outputs.heatFluxWcm2 > 8)
        notes.push('Heat flux is high for a compact enclosure; validate spreading resistance and junction-to-case resistance separately.');
    if (Number(inputs.airflowCFM) === 0)
        notes.push('Zero airflow uses natural-convection-style assumptions; orientation and venting will dominate real behavior.');
    if (Number(inputs.enclosureHeightMm) < 45)
        notes.push('Low enclosure height can create recirculation and fan bypass that this reduced-order model does not resolve.');
    return notes;
}

function reportRows(object) {
    return Object.entries(object).map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
}

export function buildReportHtml(run, screenshot) {
    const sweepRows = run.sweep.map((point) => [
        point.label,
        Object.entries(point).filter(([key]) => key !== 'label').map(([key, value]) => `${key}: ${value}`).join(', '),
    ]);

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Phoenix 3D Simulation Report</title>
  <style>
    body { color: #172033; font-family: Inter, Arial, sans-serif; line-height: 1.45; margin: 32px; }
    h1 { font-size: 30px; letter-spacing: -0.03em; margin: 4px 0 8px; }
    h2 { color: #23304a; font-size: 16px; margin: 22px 0 10px; }
    .eyebrow { color: #2f63d7; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    .meta { color: #526179; font-size: 12px; }
    .status { background: #eef4ff; border: 1px solid #c9d9ff; border-radius: 10px; display: inline-block; font-weight: 700; margin-top: 12px; padding: 8px 12px; }
    .grid { display: grid; gap: 18px; grid-template-columns: 1fr 1fr; }
    img { border: 1px solid #d9e1ef; border-radius: 12px; max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #d9e1ef; font-size: 12px; padding: 8px; text-align: left; vertical-align: top; }
    th { color: #526179; width: 42%; }
    li { font-size: 12px; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="eyebrow">Phoenix Engine 3D Simulation Report</div>
  <h1>${escapeHtml(SIMULATION_MODULES[run.inputs.moduleType]?.label || '3D Simulation Concept')}</h1>
  <div class="meta">Run ID: ${escapeHtml(run.id)} · Created: ${escapeHtml(formatDate(run.createdAt))}</div>
  <div class="status">${escapeHtml(run.outputs.status)}</div>
  ${screenshot ? `<h2>3D Snapshot</h2><img src="${screenshot}" alt="3D simulation snapshot" />` : ''}
  <section class="grid">
    <div><h2>Inputs</h2><table>${reportRows(run.inputs)}</table></div>
    <div><h2>Outputs</h2><table>${reportRows(run.outputs)}</table></div>
  </section>
  <h2>Sensitivity Sweep</h2>
  <table>${sweepRows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}</table>
  <h2>Assumptions</h2>
  <ul>${run.assumptions.map((assumption) => `<li>${escapeHtml(assumption)}</li>`).join('')}</ul>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 150));</script>
</body>
</html>`;
}

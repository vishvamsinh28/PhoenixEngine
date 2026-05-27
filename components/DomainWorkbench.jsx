'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Droplets, Layers3, Trash2, Wind } from 'lucide-react';
import RunInsights from '@/components/RunInsights';

const WORKBENCHES = {
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
        sweepTitle: 'Velocity sensitivity',
        sweepRow: (point) => `${point.label} (${point.velocityMS} m/s)`,
        sweepResult: (point) => `${point.dragN} N drag`,
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
        sweepTitle: 'Flow-rate sensitivity',
        sweepRow: (point) => `${point.label} (${point.flowRateLMin} L/min)`,
        sweepResult: (point) => `${point.coolantOutletC} C / ${point.pressureDropKPa} kPa`,
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
        sweepTitle: 'Edge temperature sensitivity',
        sweepRow: (point) => `${point.label} (${point.edgeTemperatureC} C)`,
        sweepResult: (point) => `${point.nonuniformityPercent}% non-uniformity`,
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

function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function DomainWorkbench({ projectId, disabled, onDiscuss }) {
    const config = WORKBENCHES[projectId];
    const initialInputs = Object.fromEntries(config.inputs.map((input) => [input.name, input.value]));
    const [isOpen, setIsOpen] = useState(true);
    const [inputs, setInputs] = useState(initialInputs);
    const [runs, setRuns] = useState([]);
    const [selectedRunId, setSelectedRunId] = useState('');
    const [compareRunId, setCompareRunId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState('');
    const selectedRun = useMemo(() => runs.find((run) => run.id === selectedRunId) || runs[0], [runs, selectedRunId]);
    const compareRun = useMemo(() => runs.find((run) => run.id === compareRunId), [runs, compareRunId]);
    const validationNotes = useMemo(() => config.validation(inputs), [config, inputs]);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        setError('');

        fetch(config.endpoint)
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok)
                    throw new Error(payload.error || 'Unable to load saved runs.');
                return payload.runs || [];
            })
            .then((savedRuns) => {
                if (mounted) {
                    setRuns(savedRuns);
                    setSelectedRunId(savedRuns[0]?.id || '');
                    setIsLoading(false);
                }
            })
            .catch((failure) => {
                if (mounted) {
                    setError(failure.message);
                    setIsLoading(false);
                }
            });
        return () => {
            mounted = false;
        };
    }, [config.endpoint]);

    const runScreening = async (event) => {
        event.preventDefault();
        setError('');
        setIsRunning(true);
        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to calculate this screening run.');
            setRuns((previous) => [payload.run, ...previous]);
            setSelectedRunId(payload.run.id);
        }
        catch (failure) {
            setError(failure.message);
        }
        finally {
            setIsRunning(false);
        }
    };

    const deleteRun = async (runId) => {
        setError('');
        try {
            const response = await fetch(config.endpoint, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId }),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to delete run.');
            setRuns((previous) => previous.filter((run) => run.id !== runId));
            if (selectedRunId === runId)
                setSelectedRunId('');
        }
        catch (failure) {
            setError(failure.message);
        }
    };

    const margin = selectedRun ? config.margin(selectedRun) : 0;
    const marginColor = margin < 0 ? 'text-[#f29bab]' : margin < (selectedRun ? config.warningThreshold(selectedRun) : 0) ? 'text-[#f5bd73]' : 'text-[#6de1b0]';
    const Icon = config.Icon;

    return (<section className="mb-6 rounded-[22px] border border-[#273c58]/80 bg-[#121e31]/80 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d3048] text-[#77aaff]"><Icon className="h-5 w-5"/></span>
          <span>
            <span className="block text-sm font-semibold text-[#e4ebf7]">{config.title}</span>
            <span className="block text-xs text-[#899ab6]">{config.subtitle}</span>
          </span>
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-[#8496b2]"/> : <ChevronDown className="h-4 w-4 text-[#8496b2]"/>}
      </button>

      {isOpen && (<div className="border-t border-[#273c58]/68 px-5 pb-5 pt-4">
        <form onSubmit={runScreening}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {config.inputs.map((field) => (<label key={field.name} className="text-xs text-[#9cacc4]">
                {field.label} <span className="text-[#687c9a]">({field.unit})</span>
                <input required type="number" step="any" name={field.name} value={inputs[field.name]} onChange={(event) => setInputs((previous) => ({ ...previous, [field.name]: event.target.value }))} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0] focus:shadow-[0_0_0_3px_rgba(78,126,235,0.14)]"/>
              </label>))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button disabled={disabled || isRunning} className="rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-4 py-2 text-sm font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)] disabled:cursor-wait disabled:opacity-60">
              {isRunning ? 'Calculating...' : 'Run screening'}
            </button>
            <p className="text-xs text-[#7185a3]">{config.footer}</p>
          </div>
          {validationNotes.length > 0 && (<div className="mt-4 rounded-xl border border-[#5a4620] bg-[#2b2416]/86 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5bd73]">
                <AlertTriangle className="h-4 w-4"/>
                Input validation notes
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-[#d9c39a]">
                {validationNotes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>)}
        </form>

        {error && <p className="mt-4 rounded-lg bg-[#38202d]/90 px-3 py-2 text-sm text-[#f3a8ba]">{error}</p>}
        {isLoading && <p className="mt-5 text-sm text-[#91a1bd]">Loading saved runs...</p>}
        {selectedRun && (<div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-xl bg-[#172438]/82 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Latest result</h4>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {config.metrics.map((metric) => <div key={metric.label}><p className="text-xs text-[#788ca9]">{metric.label}</p><p className="mt-1 text-lg font-semibold text-[#eaf0fa]">{metric.read(selectedRun)}</p></div>)}
              </div>
              <p className={`mt-3 text-xs font-medium ${marginColor}`}>{selectedRun.outputs.status}</p>
              <div className="mt-5">
                <RunInsights
                  assumptions={selectedRun.assumptions}
                  chart={config.chart}
                  compareRun={compareRun}
                  disabled={disabled}
                  metrics={config.metrics}
                  onCompareRunChange={setCompareRunId}
                  onDiscuss={() => onDiscuss(config.discussion(selectedRun))}
                  run={selectedRun}
                  runs={runs}
                  title={config.title}
                  transparency={config.transparency}
                />
              </div>
            </div>
            <aside className="rounded-xl bg-[#172438]/82 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Saved runs</h4>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {runs.map((run) => (<div key={run.id} className={`flex items-center gap-1 rounded-lg ${run.id === selectedRun?.id ? 'bg-[#213550]' : 'hover:bg-[#1c2d46]'}`}>
                    <button type="button" onClick={() => setSelectedRunId(run.id)} className="min-w-0 flex-1 px-2 py-2 text-left">
                      <span className="block truncate text-xs text-[#d3ddec]">{config.summary(run)}</span>
                      <span className="block text-[11px] text-[#7387a5]">{formatDate(run.createdAt)}</span>
                    </button>
                    <button type="button" title="Delete run" onClick={() => deleteRun(run.id)} className="mr-1 rounded-md p-1.5 text-[#7f91ad] hover:bg-[#352433] hover:text-[#e39cab]"><Trash2 className="h-3.5 w-3.5"/></button>
                  </div>))}
              </div>
            </aside>
          </div>)}
      </div>)}
    </section>);
}

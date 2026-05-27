'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, MessageSquare, Trash2 } from 'lucide-react';

const DEFAULT_INPUTS = {
    powerW: '75',
    effectiveAreaCm2: '250',
    pathThicknessMm: '2',
    conductivityWmK: '205',
    contactResistanceKW: '0.15',
    heatTransferCoefficient: '45',
    ambientC: '25',
    maxTemperatureC: '90',
};

const INPUT_FIELDS = [
    { name: 'powerW', label: 'Heat load', unit: 'W' },
    { name: 'effectiveAreaCm2', label: 'Effective area', unit: 'cm2' },
    { name: 'pathThicknessMm', label: 'Path thickness', unit: 'mm' },
    { name: 'conductivityWmK', label: 'Conductivity', unit: 'W/mK' },
    { name: 'contactResistanceKW', label: 'Interface R', unit: 'K/W' },
    { name: 'heatTransferCoefficient', label: 'Convection h', unit: 'W/m2K' },
    { name: 'ambientC', label: 'Ambient', unit: 'C' },
    { name: 'maxTemperatureC', label: 'Max temperature', unit: 'C' },
];

function buildDiscussionPrompt(run) {
    return [
        'Interpret this saved deterministic thermal screening run and recommend the next design change or measurement.',
        `Inputs: heat load ${run.inputs.powerW} W; effective area ${run.inputs.effectiveAreaCm2} cm2; path thickness ${run.inputs.pathThicknessMm} mm; conductivity ${run.inputs.conductivityWmK} W/mK; interface resistance ${run.inputs.contactResistanceKW} K/W; h ${run.inputs.heatTransferCoefficient} W/m2K; ambient ${run.inputs.ambientC} C; limit ${run.inputs.maxTemperatureC} C.`,
        `Calculated result: total thermal resistance ${run.outputs.totalResistanceKW} K/W; predicted temperature ${run.outputs.predictedTemperatureC} C; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
        'Treat this as a preliminary analytical resistance-network estimate, not validated CFD or FEA.',
    ].join('\n');
}

function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function ThermalWorkbench({ disabled, onDiscuss }) {
    const [isOpen, setIsOpen] = useState(true);
    const [inputs, setInputs] = useState(DEFAULT_INPUTS);
    const [runs, setRuns] = useState([]);
    const [selectedRunId, setSelectedRunId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState('');
    const selectedRun = useMemo(
        () => runs.find((run) => run.id === selectedRunId) || runs[0],
        [runs, selectedRunId],
    );

    useEffect(() => {
        let mounted = true;

        fetch('/api/thermal-runs')
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok)
                    throw new Error(payload.error || 'Unable to load thermal runs.');
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
    }, []);

    const updateInput = (event) => {
        setInputs((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    };

    const runScreening = async (event) => {
        event.preventDefault();
        setError('');
        setIsRunning(true);
        try {
            const response = await fetch('/api/thermal-runs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to calculate thermal run.');
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
            const response = await fetch('/api/thermal-runs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId }),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to delete thermal run.');
            setRuns((previous) => previous.filter((run) => run.id !== runId));
            if (selectedRunId === runId)
                setSelectedRunId('');
        }
        catch (failure) {
            setError(failure.message);
        }
    };

    const marginColor = selectedRun?.outputs.marginC < 0
        ? 'text-[#f29bab]'
        : selectedRun?.outputs.marginC < 10
            ? 'text-[#f5bd73]'
            : 'text-[#6de1b0]';

    return (<section className="mb-6 rounded-[22px] border border-[#273c58]/80 bg-[#121e31]/80 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d3048] text-[#77aaff]"><Calculator className="h-5 w-5"/></span>
          <span>
            <span className="block text-sm font-semibold text-[#e4ebf7]">Thermal Resistance Screening</span>
            <span className="block text-xs text-[#899ab6]">Deterministic estimate with saved sensitivity runs</span>
          </span>
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-[#8496b2]"/> : <ChevronDown className="h-4 w-4 text-[#8496b2]"/>}
      </button>

      {isOpen && (<div className="border-t border-[#273c58]/68 px-5 pb-5 pt-4">
        <form onSubmit={runScreening}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INPUT_FIELDS.map((field) => (<label key={field.name} className="text-xs text-[#9cacc4]">
                {field.label} <span className="text-[#687c9a]">({field.unit})</span>
                <input
                  required
                  type="number"
                  step="any"
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={updateInput}
                  className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0] focus:shadow-[0_0_0_3px_rgba(78,126,235,0.14)]"
                />
              </label>))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button disabled={disabled || isRunning} className="rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-4 py-2 text-sm font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)] disabled:cursor-wait disabled:opacity-60">
              {isRunning ? 'Calculating...' : 'Run screening'}
            </button>
            <p className="text-xs text-[#7185a3]">Steady-state resistance network, saved to this account.</p>
          </div>
        </form>

        {error && <p className="mt-4 rounded-lg bg-[#38202d]/90 px-3 py-2 text-sm text-[#f3a8ba]">{error}</p>}
        {isLoading && <p className="mt-5 text-sm text-[#91a1bd]">Loading saved runs...</p>}

        {selectedRun && (<div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-xl bg-[#172438]/82 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Latest result</h4>
                <button type="button" disabled={disabled} onClick={() => onDiscuss(buildDiscussionPrompt(selectedRun))} className="flex items-center gap-1.5 rounded-lg bg-[#213550] px-3 py-1.5 text-xs text-[#aec8f3] hover:bg-[#28405f] disabled:opacity-50">
                  <MessageSquare className="h-3.5 w-3.5"/>
                  Discuss in chat
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div><p className="text-xs text-[#788ca9]">Predicted temp</p><p className="mt-1 text-lg font-semibold text-[#eaf0fa]">{selectedRun.outputs.predictedTemperatureC} C</p></div>
                <div><p className="text-xs text-[#788ca9]">Thermal R</p><p className="mt-1 text-lg font-semibold text-[#eaf0fa]">{selectedRun.outputs.totalResistanceKW} K/W</p></div>
                <div><p className="text-xs text-[#788ca9]">Temperature rise</p><p className="mt-1 text-lg font-semibold text-[#eaf0fa]">{selectedRun.outputs.temperatureRiseC} C</p></div>
                <div><p className="text-xs text-[#788ca9]">Margin</p><p className={`mt-1 text-lg font-semibold ${marginColor}`}>{selectedRun.outputs.marginC} C</p></div>
              </div>
              <p className={`mt-3 text-xs font-medium ${marginColor}`}>{selectedRun.outputs.status}</p>

              <h5 className="mt-5 text-xs font-semibold uppercase tracking-[0.13em] text-[#7186a4]">Convection sensitivity</h5>
              <div className="mt-2 overflow-hidden rounded-lg bg-[#111b2c]">
                {selectedRun.sweep.map((point) => (<div key={point.label} className="flex items-center justify-between px-3 py-2 text-xs text-[#b7c5d9] [&+&]:border-t [&+&]:border-[#21344e]">
                    <span>{point.label} ({point.heatTransferCoefficient} W/m2K)</span>
                    <span className="font-medium text-[#dee7f4]">{point.predictedTemperatureC} C</span>
                  </div>))}
              </div>
              <details className="mt-4 text-xs text-[#91a3bd]">
                <summary className="cursor-pointer text-[#aab9d0]">Assumptions and limitations</summary>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {selectedRun.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                </ul>
              </details>
            </div>

            <aside className="rounded-xl bg-[#172438]/82 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Saved runs</h4>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {runs.map((run) => (<div key={run.id} className={`flex items-center gap-1 rounded-lg ${run.id === selectedRun?.id ? 'bg-[#213550]' : 'hover:bg-[#1c2d46]'}`}>
                    <button type="button" onClick={() => setSelectedRunId(run.id)} className="min-w-0 flex-1 px-2 py-2 text-left">
                      <span className="block truncate text-xs text-[#d3ddec]">{run.outputs.predictedTemperatureC} C / {run.outputs.marginC} C margin</span>
                      <span className="block text-[11px] text-[#7387a5]">{formatDate(run.createdAt)}</span>
                    </button>
                    <button type="button" title="Delete run" onClick={() => deleteRun(run.id)} className="mr-1 rounded-md p-1.5 text-[#7f91ad] hover:bg-[#352433] hover:text-[#e39cab]">
                      <Trash2 className="h-3.5 w-3.5"/>
                    </button>
                  </div>))}
              </div>
            </aside>
          </div>)}
      </div>)}
    </section>);
}

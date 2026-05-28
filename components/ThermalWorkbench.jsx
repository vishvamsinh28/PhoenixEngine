'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Calculator, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import RunInsights from '@/components/RunInsights';

import { THERMAL_DEFAULT_INPUTS, THERMAL_INPUT_FIELDS, THERMAL_METRICS, THERMAL_TRANSPARENCY, buildThermalDiscussionPrompt, getThermalValidationNotes } from '@/data/thermalWorkbenchConfig';
import { formatDate } from '@/lib/dateFormat';

export default function ThermalWorkbench({ disabled, onDiscuss }) {
    const [isOpen, setIsOpen] = useState(true);
    const [inputs, setInputs] = useState(THERMAL_DEFAULT_INPUTS);
    const [runs, setRuns] = useState([]);
    const [selectedRunId, setSelectedRunId] = useState('');
    const [compareRunId, setCompareRunId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState('');
    const selectedRun = useMemo(
        () => runs.find((run) => run.id === selectedRunId) || runs[0],
        [runs, selectedRunId],
    );
    const compareRun = useMemo(
        () => runs.find((run) => run.id === compareRunId),
        [runs, compareRunId],
    );
    const validationNotes = useMemo(() => getThermalValidationNotes(inputs), [inputs]);

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
            {THERMAL_INPUT_FIELDS.map((field) => (<label key={field.name} className="text-xs text-[#9cacc4]">
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
          {validationNotes.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#5a4620] bg-[#2b2416]/86 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5bd73]">
                <AlertTriangle className="h-4 w-4" />
                Input validation notes
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-[#d9c39a]">
                {validationNotes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          )}
        </form>

        {error && <p className="mt-4 rounded-lg bg-[#38202d]/90 px-3 py-2 text-sm text-[#f3a8ba]">{error}</p>}
        {isLoading && <p className="mt-5 text-sm text-[#91a1bd]">Loading saved runs...</p>}

        {selectedRun && (<div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-xl bg-[#172438]/82 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Latest result</h4>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {THERMAL_METRICS.map((metric) => (
                  <div key={metric.label}><p className="text-xs text-[#788ca9]">{metric.label}</p><p className={`mt-1 text-lg font-semibold ${metric.label === 'Margin' ? marginColor : 'text-[#eaf0fa]'}`}>{metric.read(selectedRun)}</p></div>
                ))}
              </div>
              <p className={`mt-3 text-xs font-medium ${marginColor}`}>{selectedRun.outputs.status}</p>

              <div className="mt-5">
                <RunInsights
                  assumptions={selectedRun.assumptions}
                  chart={{
                    title: 'Convection sensitivity',
                    points: (run) => run.sweep.map((point) => ({
                      label: `${point.label} (${point.heatTransferCoefficient} W/m2K)`,
                      value: point.predictedTemperatureC,
                      display: `${point.predictedTemperatureC} C`,
                    })),
                  }}
                  compareRun={compareRun}
                  disabled={disabled}
                  metrics={THERMAL_METRICS}
                  onCompareRunChange={setCompareRunId}
                  onDiscuss={() => onDiscuss(buildThermalDiscussionPrompt(selectedRun))}
                  run={selectedRun}
                  runs={runs}
                  title="Thermal Screening"
                  transparency={THERMAL_TRANSPARENCY}
                />
              </div>
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

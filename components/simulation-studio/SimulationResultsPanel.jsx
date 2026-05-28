'use client';

import { Fan, Flame, Gauge, Layers3, Plane, Thermometer, Trash2, Waves, Wind } from 'lucide-react';
import { SIMULATION_MODULES } from '@/data/simulationStudioConfig';
import { formatDate } from '@/lib/dateFormat';

export default function SimulationResultsPanel({
    displayRun,
    liveError,
    runError,
    isLoadingRuns,
    marginColor,
    runs,
    selectedRunId,
    onSelectRun,
    onDeleteRun,
}) {
    return (
        <aside className="border-t border-[#263a55]/70 bg-[#101c2d]/68 p-4 lg:no-scrollbar lg:overflow-y-auto lg:border-l lg:border-t-0">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">Results</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">{getResultTitle(displayRun)}</h2>
            </div>
            {(liveError || runError) && <p className="mb-4 rounded-lg bg-[#38202d]/90 px-3 py-2 text-sm text-[#f3a8ba]">{liveError || runError}</p>}
            {isLoadingRuns && <p className="mb-4 text-sm text-[#91a1bd]">Loading saved simulations...</p>}
            {displayRun && (
                <>
                    <MetricGrid run={displayRun} marginColor={marginColor} />
                    <p className={`mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 px-4 py-3 text-sm font-medium ${marginColor}`}>{displayRun.outputs.status}</p>
                    <SweepPanel run={displayRun} />
                    <details className="mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4 text-xs text-[#91a3bd]" open>
                        <summary className="cursor-pointer text-[#aab9d0]">Assumptions and limits</summary>
                        <ul className="mt-3 list-disc space-y-1.5 pl-4">
                            {displayRun.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                        </ul>
                    </details>
                </>
            )}
            <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Saved simulation runs</h3>
                <div className="space-y-2">
                    {runs.length === 0 && <p className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-3 text-xs text-[#8295b0]">Save a run to persist and compare simulation states.</p>}
                    {runs.map((run) => (
                        <div key={run.id} className={`flex items-center gap-2 rounded-xl ${run.id === selectedRunId ? 'bg-[#213550]' : 'bg-[#0f1a2a]/72 hover:bg-[#142238]'}`}>
                            <button type="button" onClick={() => onSelectRun(run)} className="min-w-0 flex-1 px-3 py-2 text-left">
                                <span className="block truncate text-xs text-[#d3ddec]">{SIMULATION_MODULES[run.inputs.moduleType]?.label || 'Simulation'} / {formatSavedRunValue(run)}</span>
                                <span className="block text-[11px] text-[#7387a5]">{formatDate(run.createdAt)}</span>
                            </button>
                            <button type="button" title="Delete run" onClick={() => onDeleteRun(run.id)} className="mr-2 rounded-md p-1.5 text-[#7f91ad] hover:bg-[#352433] hover:text-[#e39cab]"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function getResultTitle(run) {
    if (!run)
        return 'Simulation state';
    if (run.inputs.moduleType === 'battery')
        return 'Cooling state';
    if (run.inputs.moduleType === 'aerodynamics')
        return 'Flow-force state';
    if (run.inputs.moduleType === 'process')
        return 'Uniformity state';
    return 'Thermal state';
}

function formatSavedRunValue(run) {
    if (run.inputs.moduleType === 'aerodynamics')
        return `${run.outputs.dragN} N drag / ${run.outputs.dragMarginN} N margin`;
    if (run.inputs.moduleType === 'process')
        return `${run.outputs.nonuniformityPercent}% / ${run.outputs.uniformityMarginPercent}% margin`;
    return `${run.outputs.primaryValue} C / ${run.outputs.marginC} C margin`;
}

function MetricGrid({ run, marginColor }) {
    let metrics;
    if (run.inputs.moduleType === 'battery') {
        metrics = [
            { label: 'Cell max', Icon: Thermometer, value: `${run.outputs.estimatedCellMaxC} C` },
            { label: 'Margin', Icon: Gauge, value: `${run.outputs.marginC} C`, className: marginColor },
            { label: 'Outlet', Icon: Waves, value: `${run.outputs.coolantOutletC} C` },
            { label: 'Pressure drop', Icon: Wind, value: `${run.outputs.pressureDropKPa} kPa` },
        ];
    }
    else if (run.inputs.moduleType === 'aerodynamics') {
        metrics = [
            { label: 'Drag', Icon: Wind, value: `${run.outputs.dragN} N` },
            { label: 'Lift', Icon: Plane, value: `${run.outputs.liftN} N` },
            { label: 'Reynolds', Icon: Gauge, value: run.outputs.reynoldsNumber.toLocaleString() },
            { label: 'Drag margin', Icon: Gauge, value: `${run.outputs.dragMarginN} N`, className: marginColor },
        ];
    }
    else if (run.inputs.moduleType === 'process') {
        metrics = [
            { label: 'Mean thickness', Icon: Layers3, value: `${run.outputs.meanThicknessNm} nm` },
            { label: 'Nonuniformity', Icon: Gauge, value: `${run.outputs.nonuniformityPercent}%` },
            { label: 'Uniformity margin', Icon: Gauge, value: `${run.outputs.uniformityMarginPercent}%`, className: marginColor },
            { label: 'Thickness error', Icon: Flame, value: `${run.outputs.thicknessErrorNm} nm` },
        ];
    }
    else {
        metrics = [
            { label: 'Hotspot', Icon: Thermometer, value: `${run.outputs.predictedHotspotC} C` },
            { label: 'Margin', Icon: Gauge, value: `${run.outputs.marginC} C`, className: marginColor },
            { label: 'Thermal R', Icon: Flame, value: `${run.outputs.totalResistanceKW} K/W` },
            { label: 'Air h', Icon: Wind, value: `${run.outputs.convectionCoefficientWm2K} W/m2K` },
        ];
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {metrics.map(({ label, Icon, value, className }) => (
                <div key={label} className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
                    <div className="flex items-center gap-2 text-xs text-[#8295b0]">
                        <Icon className="h-4 w-4 text-[#65c6ff]" />
                        {label}
                    </div>
                    <p className={`mt-2 text-xl font-semibold ${className || 'text-[#edf3fb]'}`}>{value}</p>
                </div>
            ))}
        </div>
    );
}

function SweepPanel({ run }) {
    const maxValue = Math.max(...run.sweep.map((point) => getSweepNumericValue(run, point)), 1);
    return (
        <div className="mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                <Fan className="h-4 w-4" />
                {getSweepTitle(run)}
            </div>
            <div className="mt-4 space-y-3">
                {run.sweep.map((point) => {
                    const value = getSweepNumericValue(run, point);
                    return (
                        <div key={point.label} className="grid grid-cols-[82px_minmax(0,1fr)_auto] items-center gap-3 text-xs text-[#b7c5d9]">
                            <span>{getSweepAxisLabel(run, point)}</span>
                            <span className="h-2 overflow-hidden rounded-full bg-[#223550]">
                                <span className="block h-full rounded-full bg-[linear-gradient(90deg,#f1695f,#f5bd73,#56c1ff)]" style={{ width: `${Math.max(8, (value / maxValue) * 100)}%` }} />
                            </span>
                            <span className="font-medium text-[#dee7f4]">{getSweepDisplayValue(run, point)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getSweepTitle(run) {
    if (run.inputs.moduleType === 'battery')
        return 'Coolant-flow sweep';
    if (run.inputs.moduleType === 'aerodynamics')
        return 'Velocity sweep';
    if (run.inputs.moduleType === 'process')
        return 'Edge-temperature sweep';
    return 'Airflow sweep';
}

function getSweepAxisLabel(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.flowRateLMin} L/min`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.velocityMS} m/s`;
    if (run.inputs.moduleType === 'process')
        return `${point.edgeTemperatureC} C`;
    return `${point.airflowCFM} CFM`;
}

function getSweepNumericValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return point.estimatedCellMaxC;
    if (run.inputs.moduleType === 'aerodynamics')
        return point.dragN;
    if (run.inputs.moduleType === 'process')
        return point.nonuniformityPercent;
    return point.predictedHotspotC;
}

function getSweepDisplayValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.estimatedCellMaxC} C`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.dragN} N`;
    if (run.inputs.moduleType === 'process')
        return `${point.nonuniformityPercent}%`;
    return `${point.predictedHotspotC} C`;
}

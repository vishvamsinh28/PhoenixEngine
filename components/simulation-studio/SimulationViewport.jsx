'use client';

import { Camera, Eye, Flame, Wind } from 'lucide-react';
import { VIEW_PRESETS } from '@/data/simulationStudioConfig';
import { formatSweepCardValue, getSweepPointMargin } from '@/lib/simulationStudioPresentation';

export default function SimulationViewport({
    displayRun,
    isRunning,
    isTabVisible,
    mountRef,
    showAirflow,
    showEnclosure,
    showHeat,
    viewPreset,
    onToggleAirflow,
    onToggleEnclosure,
    onToggleHeat,
    onViewPresetChange,
}) {
    return (
        <section className="relative flex min-h-[430px] flex-col overflow-hidden bg-[#0c1726] sm:block sm:min-h-[500px]">
            <div className="z-10 grid gap-2 border-b border-[#263a55]/70 bg-[#101c2d]/88 p-3 text-xs text-[#aab9d0] backdrop-blur sm:hidden">
                <div className="flex gap-2 overflow-x-auto">
                    {Object.entries(VIEW_PRESETS).map(([id, preset]) => (
                        <button key={id} type="button" onClick={() => onViewPresetChange(id)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${viewPreset === id ? 'bg-[#28405f] text-[#edf3fb]' : 'bg-[#172438] hover:bg-[#1d3048]'}`}>
                            <Camera className="h-3.5 w-3.5" />
                            {preset.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="shrink-0 rounded-lg border border-[#2b405d]/90 bg-[#0d1828] px-2.5 py-1.5">
                        {isRunning && isTabVisible ? 'Live' : isRunning ? 'Hidden pause' : 'Static'}
                    </span>
                    <LayerToggle active={showAirflow} Icon={Wind} label="Flow" onClick={onToggleAirflow} mobile />
                    <LayerToggle active={showEnclosure} Icon={Eye} label="Shell" onClick={onToggleEnclosure} mobile />
                    <LayerToggle active={showHeat} Icon={Flame} label="Heat" onClick={onToggleHeat} mobile />
                </div>
            </div>
            <div ref={mountRef} className="h-[360px] min-h-[360px] w-full flex-1 cursor-grab active:cursor-grabbing sm:h-full sm:min-h-[500px]" />
            <div className="absolute left-4 top-4 hidden flex-wrap gap-2 rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 p-2 text-xs text-[#aab9d0] backdrop-blur sm:flex">
                {Object.entries(VIEW_PRESETS).map(([id, preset]) => (
                    <button key={id} type="button" onClick={() => onViewPresetChange(id)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${viewPreset === id ? 'bg-[#28405f] text-[#edf3fb]' : 'hover:bg-[#1d3048]'}`}>
                        <Camera className="h-3.5 w-3.5" />
                        {preset.label}
                    </button>
                ))}
            </div>
            <div className="pointer-events-none absolute left-4 top-20 hidden rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 px-3 py-2 text-xs text-[#aab9d0] backdrop-blur sm:block">
                {isRunning && isTabVisible ? 'Running live animation' : isRunning ? 'Paused while tab is hidden' : 'Static preview'}
            </div>
            <div className="absolute right-4 top-4 hidden max-w-[calc(100%-2rem)] flex-wrap justify-end gap-2 rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 p-2 text-xs text-[#aab9d0] backdrop-blur sm:flex">
                <LayerToggle active={showAirflow} Icon={Wind} label="Flow" onClick={onToggleAirflow} />
                <LayerToggle active={showEnclosure} Icon={Eye} label="Shell" onClick={onToggleEnclosure} />
                <LayerToggle active={showHeat} Icon={Flame} label="Heat" onClick={onToggleHeat} />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 hidden gap-2 sm:grid sm:grid-cols-3">
                {displayRun?.sweep.slice(1, 4).map((point) => <SweepCard key={point.label} run={displayRun} point={point} />)}
            </div>
        </section>
    );
}

function SweepCard({ run, point }) {
    const margin = getSweepPointMargin(run, point);
    return (
        <div className="rounded-xl border border-[#263a55]/80 bg-[#101c2d]/78 p-3 text-xs backdrop-blur">
            <p className="text-[#7fa5ed]">{point.label}</p>
            <p className="mt-1 font-semibold text-[#edf3fb]">{formatSweepCardValue(run, point)}</p>
            <p className={margin.value < 0 ? 'text-[#f29bab]' : 'text-[#8adfb5]'}>{margin.value} {margin.unit} margin</p>
        </div>
    );
}

function LayerToggle({ active, Icon, label, mobile = false, onClick }) {
    return (
        <button type="button" onClick={onClick} className={`inline-flex ${mobile ? 'shrink-0' : ''} items-center gap-1 rounded-lg px-2.5 py-1.5 ${active ? 'bg-[#28405f] text-[#edf3fb]' : `${mobile ? 'bg-[#172438] ' : ''}hover:bg-[#1d3048]`}`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
        </button>
    );
}

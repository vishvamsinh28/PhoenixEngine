'use client';

import { Download, Layers3, MessageSquare, Pause, Play, RotateCcw, Save } from 'lucide-react';

export default function SimulationStudioHeader({
    activeModule,
    displayRun,
    disabled,
    isRunning,
    isSaving,
    liveRun,
    onDiscussRun,
    onExportReport,
    onResetInputs,
    onToggleRunning,
    onSaveRun,
}) {
    return (
        <div className="border-b border-[#263a55]/80 bg-[#162235]/60 px-4 py-3 md:rounded-t-[28px] md:px-6 md:py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,#24344b,#172538)] shadow-[0_5px_15px_rgba(0,0,0,0.15)] md:h-12 md:w-12">
                        <Layers3 className="h-5 w-5 text-[#65c6ff]" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#e1e9f4] md:text-[16px]">3D Simulation Studio</h3>
                        <p className="hidden text-[13px] text-[#95a5be] sm:block">{activeModule.subtitle}</p>
                    </div>
                </div>
                <div className="grid w-full grid-cols-5 gap-2 md:flex md:w-auto md:shrink-0 md:items-center md:gap-1.5">
                    <button type="button" onClick={onResetInputs} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#365277] bg-[#1b2d45]/86 px-3 py-2 text-xs font-medium text-[#dce8f7] transition hover:bg-[#243a58]">
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                    <button type="button" onClick={onToggleRunning} disabled={!displayRun} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isRunning ? 'bg-[#352433] text-[#f3a8ba] hover:bg-[#402a3a]' : 'bg-[#183a31] text-[#8adfb5] hover:bg-[#21483c]'}`}>
                        {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span className="hidden min-[390px]:inline">{isRunning ? 'Pause' : 'Run'}</span>
                    </button>
                    <button type="button" onClick={onSaveRun} disabled={!liveRun || isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#213550] px-3 py-2 text-xs font-medium text-[#aec8f3] transition hover:bg-[#28405f] disabled:cursor-not-allowed disabled:opacity-50">
                        <Save className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button type="button" onClick={onExportReport} disabled={!displayRun} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b3040] px-3 py-2 text-xs font-medium text-[#9edbd0] transition hover:bg-[#244155] disabled:cursor-not-allowed disabled:opacity-50">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Report</span>
                    </button>
                    <button type="button" onClick={onDiscussRun} disabled={disabled || !displayRun} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-3 py-2 text-xs font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)] disabled:cursor-not-allowed disabled:opacity-50">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Discuss</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

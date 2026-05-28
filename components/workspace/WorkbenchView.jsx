'use client';

import ChatHeader from '@/components/ChatHeader';
import DomainWorkbench from '@/components/DomainWorkbench';
import ThermalWorkbench from '@/components/ThermalWorkbench';

export default function WorkbenchView({ activeProject, disabled, onDiscuss, onOpenChat }) {
    return (
        <>
            <ChatHeader project={activeProject}/>
            <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-5 md:px-7 md:py-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-[22px] border border-[#273c58]/80 bg-[#121e31]/82 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">Workbench</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">Run deterministic screening</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#98a9c1]">
                            Calculate, compare, and save engineering runs here. Use Discuss in Chat when you want Phoenix to interpret a result.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenChat}
                        className="rounded-lg border border-[#365277] bg-[#1b2d45]/86 px-4 py-2 text-sm font-medium text-[#dce8f7] transition hover:bg-[#243a58]"
                    >
                        Open chat
                    </button>
                </div>
                {activeProject.id === 'thermal-inverter' && <ThermalWorkbench disabled={disabled} onDiscuss={onDiscuss}/>}
                {activeProject.id !== 'thermal-inverter' && <DomainWorkbench key={activeProject.id} projectId={activeProject.id} disabled={disabled} onDiscuss={onDiscuss}/>}
            </div>
        </>
    );
}

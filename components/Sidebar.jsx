'use client';
import { useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import ChatListItem from '@/components/ChatListItem';

export default function Sidebar({ projects, activeProjectId, onSelectProject, isOpen, onClose }) {
    const handleSelectProject = useCallback((projectId) => {
        onSelectProject(projectId);
        onClose();
    }, [onClose, onSelectProject]);

    return (<>
      {isOpen && (<div className="fixed inset-0 z-30 bg-[#050d12]/70 backdrop-blur-[6px] md:hidden" onClick={onClose}/>)}

      <aside className={`fixed left-3 right-3 top-[7.4rem] z-40 flex h-[calc(100dvh-8.4rem)] flex-col rounded-[24px] border border-[#1b303c] bg-[#0a161e] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out md:relative md:left-auto md:right-auto md:top-auto md:z-auto md:h-full md:w-[314px] md:flex-shrink-0 md:rounded-none md:border-0 md:border-r md:border-[#162a35] md:shadow-none
          ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100'}
        `}>
        <div className="flex items-center justify-between px-5 pb-5 pt-5 md:pt-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#567382]">Engineering runs</p>
            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-white">Projects</h2>
          </div>
          <div className="flex items-center gap-2">
            <button title="New study" className="rounded-xl border border-[#203846] bg-[#112530] p-2 transition-colors hover:bg-[#172f3b]">
              <Plus className="h-4 w-4 text-[#74d8ff]"/>
            </button>
            <button onClick={onClose} className="rounded-xl p-2 transition-colors hover:bg-[#142632] md:hidden">
              <X className="h-4 w-4 text-[#91a6b2]"/>
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {projects.map((project) => (<ChatListItem key={project.id} {...project} isActive={activeProjectId === project.id} onSelect={handleSelectProject}/>))}
        </div>
        <div className="m-4 rounded-2xl border border-[#19323f] bg-[#0f2029] p-4 text-xs text-[#76909d]">
          Physics-informed estimates should be validated against high-fidelity solvers or experiments.
        </div>
      </aside>
    </>);
}

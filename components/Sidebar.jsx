'use client';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import ChatListItem from '@/components/ChatListItem';

export default function Sidebar({ projects, activeProjectId, onSelectProject, isOpen, onClose }) {
    const handleSelectProject = useCallback((projectId) => {
        onSelectProject(projectId);
        onClose();
    }, [onClose, onSelectProject]);

    return (<>
      {isOpen && (<div className="fixed inset-0 z-30 bg-[#020711]/55 backdrop-blur-[5px] md:hidden" onClick={onClose}/>)}

      <aside className={`fixed left-3 right-3 top-[5.25rem] z-40 flex max-h-[calc(100dvh-6.25rem)] flex-col rounded-[26px] bg-[linear-gradient(145deg,rgba(20,31,49,0.96),rgba(15,27,43,0.97))] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out md:relative md:left-auto md:right-auto md:top-auto md:z-auto md:h-full md:max-h-none md:w-[304px] md:flex-shrink-0 md:rounded-[28px] md:p-2 md:shadow-[0_20px_46px_rgba(0,0,0,0.17)]
          ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100'}
        `}>
        <div className="flex items-center justify-between px-4 pb-3 pt-4 md:pb-4 md:pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7285a4]">Analysis domains</p>
            <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.04em] text-[#e1e9f5]">Domains</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-xl p-2 transition-colors hover:bg-[#1d2a3d] md:hidden">
              <X className="h-4 w-4 text-[#96a7c1]"/>
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto px-1.5 pb-2">
          {projects.map((project) => (<ChatListItem key={project.id} {...project} isActive={activeProjectId === project.id} onSelect={handleSelectProject}/>))}
        </div>
      </aside>
    </>);
}

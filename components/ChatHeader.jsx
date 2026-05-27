'use client';
import { Activity } from 'lucide-react';

export default function ChatHeader({ project }) {
    return (<div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#e6edf2] bg-[#09141c]/95 px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] md:h-12 md:w-12">
          <Activity className="h-5 w-5" style={{ color: project.color }}/>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-white md:text-[16px]">{project.name}</h3>
          <p className="text-[13px] text-[#91a6b2]">{project.discipline}</p>
        </div>
      </div>

      <p className="max-w-sm text-right text-xs text-[#78929e]">{project.context}</p>
    </div>);
}

'use client';
import { Activity, ShieldCheck } from 'lucide-react';

export default function ChatHeader({ project, runtime }) {
    return (<div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#e6edf2] bg-[#09141c]/95 px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] md:h-12 md:w-12">
          <Activity className="h-5 w-5" style={{ color: project.color }}/>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-white md:text-[16px]">{project.name}</h3>
          <p className="text-[13px] text-[#91a6b2]">{project.discipline} <span className="mx-1 text-[#4c6470]">/</span> {project.status}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full border border-[#203846] bg-[#101f29] px-3 py-1.5 text-xs font-medium text-[#b3c4cc]">
          {project.metric}
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#164936] bg-[#0d2b22] px-3 py-1.5 text-xs font-medium text-[#70e1ac]">
          <ShieldCheck className="h-3.5 w-3.5"/>
          {runtime}
        </div>
      </div>
    </div>);
}

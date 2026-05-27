'use client';
import { Activity } from 'lucide-react';

export default function ChatHeader({ project }) {
    return (<div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#ecf0f8] bg-white/72 px-4 py-4 md:rounded-t-[28px] md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#e4eafd] bg-[linear-gradient(145deg,#ffffff,#f0f4ff)] md:h-12 md:w-12">
          <Activity className="h-5 w-5" style={{ color: project.color }}/>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#172743] md:text-[16px]">{project.name}</h3>
          <p className="text-[13px] text-[#7a89a5]">{project.discipline}</p>
        </div>
      </div>

      <p className="max-w-sm rounded-full bg-[#f3f6ff] px-3 py-2 text-right text-xs text-[#7484a1]">{project.context}</p>
    </div>);
}

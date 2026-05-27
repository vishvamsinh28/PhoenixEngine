'use client';
import { Activity } from 'lucide-react';

export default function ChatHeader({ project }) {
    return (<div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 bg-[#162235]/60 px-4 py-4 md:rounded-t-[28px] md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,#24344b,#172538)] shadow-[0_5px_15px_rgba(0,0,0,0.15)] md:h-12 md:w-12">
          <Activity className="h-5 w-5" style={{ color: project.color }}/>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#e1e9f4] md:text-[16px]">{project.name}</h3>
          <p className="text-[13px] text-[#95a5be]">{project.discipline}</p>
        </div>
      </div>

      <p className="max-w-sm rounded-full bg-[#1b2a40]/74 px-3 py-2 text-right text-xs text-[#a1b0c7]">{project.context}</p>
    </div>);
}

'use client';
import { Video, Phone } from 'lucide-react';
import { applyAvatarFallback } from '@/lib/chatUtils';

export default function ChatHeader({ chat }) {
    return (<div className="flex flex-shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={chat.avatar} alt={chat.name} className="h-11 w-11 rounded-full object-cover ring-1 ring-black/5 md:h-12 md:w-12" onError={(event) => applyAvatarFallback(event, chat.name)}/>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#1e2a45] md:text-[16px]">{chat.name}</h3>
          <p className="text-[13px] text-[#96a0b5]">{chat.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ebf4] bg-white text-[#4f5d78] shadow-[0_1px_2px_rgba(31,42,68,0.02)] transition-colors hover:bg-[#f6f8fc]">
          <Video className="h-4 w-4"/>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ebf4] bg-white text-[#4f5d78] shadow-[0_1px_2px_rgba(31,42,68,0.02)] transition-colors hover:bg-[#f6f8fc]">
          <Phone className="h-4 w-4"/>
        </button>
      </div>
    </div>);
}

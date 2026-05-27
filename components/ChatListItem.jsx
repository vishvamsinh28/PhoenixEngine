'use client';

import { memo } from 'react';
import { Box } from 'lucide-react';

function ChatListItem({ id, name, discipline, color, messageCount, lastMessagePreview, isActive, onSelect }) {
    return (<button onClick={() => onSelect(id)} className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition-all duration-150 ${isActive
            ? 'border border-[#dbe7ff] bg-[linear-gradient(118deg,#eef3ff,#eefbff)] shadow-[0_8px_22px_rgba(62,96,163,0.08)]'
            : 'border border-transparent bg-transparent hover:bg-white'}`}>
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] ${isActive ? 'bg-white shadow-sm' : 'bg-[#eff4ff]'}`}>
        <Box className="h-5 w-5" style={{ color }}/>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[#1b2c4a]">
          {name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#7283a2]">{discipline}{messageCount > 0 ? ` / ${messageCount} messages` : ''}</p>
        <p className="mt-1 truncate text-[12px] text-[#8998b2]">{lastMessagePreview}</p>
      </div>
    </button>);
}

export default memo(ChatListItem);

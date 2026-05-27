'use client';

import { memo } from 'react';
import { Box } from 'lucide-react';

function ChatListItem({ id, name, discipline, color, lastMessagePreview, isActive, onSelect }) {
    return (<button onClick={() => onSelect(id)} className={`group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-all duration-150 ${isActive
            ? 'bg-[#152936] ring-1 ring-[#234352]'
            : 'bg-transparent hover:bg-[#10212c]'}`}>
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#142632]">
        <Box className="h-5 w-5" style={{ color }}/>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[14px] font-semibold tracking-[-0.01em] ${isActive ? 'text-white' : 'text-[#d9e4e9]'}`}>
          {name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#7c96a4]">{discipline}</p>
        <p className="mt-1 truncate text-[12px] text-[#647d8a]">{lastMessagePreview}</p>
      </div>
    </button>);
}

export default memo(ChatListItem);

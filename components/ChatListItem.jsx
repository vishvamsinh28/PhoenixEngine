'use client';

import { memo } from 'react';
import { Box } from 'lucide-react';

function ChatListItem({ id, name, discipline, color, messageCount, lastMessagePreview, isActive, onSelect }) {
    return (<button onClick={() => onSelect(id)} className={`group flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition-all duration-150 ${isActive
            ? 'bg-[linear-gradient(118deg,rgba(31,45,68,0.95),rgba(23,47,63,0.95))] shadow-[0_10px_25px_rgba(0,0,0,0.16)]'
            : 'bg-transparent hover:bg-[#182538]/66'}`}>
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] ${isActive ? 'bg-[#233348] shadow-sm' : 'bg-[#1b293d]/76'}`}>
        <Box className="h-5 w-5" style={{ color }}/>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[#dde6f2]">
          {name}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#91a1ba]">{discipline}{messageCount > 0 ? ` / ${messageCount} messages` : ''}</p>
        <p className="mt-1 truncate text-[12px] text-[#71829e]">{lastMessagePreview}</p>
      </div>
    </button>);
}

export default memo(ChatListItem);

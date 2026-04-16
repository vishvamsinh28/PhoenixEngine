'use client';

import { memo } from 'react';
import { applyAvatarFallback } from '@/lib/chatUtils';

function ChatListItem({ id, name, avatar, lastMessagePreview, isActive, onSelect }) {
    return (<button onClick={() => onSelect(id)} className={`group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-all duration-150 ${isActive
            ? 'bg-[#edf3ff]'
            : 'bg-transparent hover:bg-white/70'}`}>
      <div className="relative flex-shrink-0">
        <img src={avatar} alt={name} className="h-11 w-11 rounded-full object-cover ring-1 ring-black/5" onError={(event) => applyAvatarFallback(event, name)}/>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] font-semibold tracking-[-0.01em] ${isActive ? 'text-[#264fcb]' : 'text-[#25314d]'}`}>
          {name}
        </p>
        <p className="mt-1 truncate text-[13px] text-[#9aa4b7]">{lastMessagePreview}</p>
      </div>
    </button>);
}

export default memo(ChatListItem);

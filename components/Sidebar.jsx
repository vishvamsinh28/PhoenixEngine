'use client';
import { useCallback } from 'react';
import { SquarePen, X } from 'lucide-react';
import ChatListItem from '@/components/ChatListItem';

export default function Sidebar({ chats, activeChatId, onSelectChat, isOpen, onClose }) {
    const handleSelectChat = useCallback((chatId) => {
        onSelectChat(chatId);
        onClose();
    }, [onClose, onSelectChat]);

    return (<>
      {isOpen && (<div className="fixed inset-0 z-30 bg-[#1f2a44]/22 backdrop-blur-[6px] md:hidden" onClick={onClose}/>)}

      <aside className={`fixed left-3 right-3 top-[7.4rem] z-40 flex h-[calc(100dvh-8.4rem)] flex-col rounded-[28px] bg-[linear-gradient(135deg,#fbf8ff_0%,#f7f4ff_52%,#f3f7ff_100%)] shadow-[0_18px_50px_rgba(31,42,68,0.16)] transition-all duration-300 ease-in-out md:relative md:left-auto md:right-auto md:top-auto md:z-auto md:h-full md:w-[324px] md:flex-shrink-0 md:rounded-none md:bg-[linear-gradient(135deg,#fbf8ff_0%,#f7f4ff_52%,#f3f7ff_100%)] md:shadow-none
          ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100'}
        `}>
        <div className="flex items-center justify-between px-5 pb-4 pt-5 md:pt-10">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c2846]">Chats</h2>
          <div className="flex items-center gap-2">
            <button className="rounded-xl p-2 transition-colors hover:bg-[#eef3fb]">
              <SquarePen className="h-4 w-4 text-[#5f687d]"/>
            </button>
            <button onClick={onClose} className="rounded-xl p-2 transition-colors hover:bg-[#eef3fb] md:hidden">
              <X className="h-4 w-4 text-[#5f687d]"/>
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,244,255,0.2)_0%,rgba(243,245,255,0.5)_100%)] px-3 pb-4">
          {chats.map((chat) => (<ChatListItem key={chat.id} id={chat.id} name={chat.name} avatar={chat.avatar} lastMessagePreview={chat.lastMessagePreview} isActive={activeChatId === chat.id} onSelect={handleSelectChat}/>))}
        </div>
      </aside>
    </>);
}

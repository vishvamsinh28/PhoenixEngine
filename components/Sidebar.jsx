'use client';
import { SquarePen, X } from 'lucide-react';
export default function Sidebar({ chats, activeChatId, onSelectChat, isOpen, onClose }) {
    return (<>
      {isOpen && (<div className="fixed inset-0 z-30 bg-[#1f2a44]/20 backdrop-blur-[2px] md:hidden" onClick={onClose}/>)}

      <aside className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-[#e8edf6] bg-[linear-gradient(180deg,#fbfcff_0%,#f7f8fe_100%)] transition-transform duration-300 ease-in-out md:relative md:z-auto
          w-[320px] md:w-[324px] md:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
        <div className="flex items-center justify-between px-5 pb-4 pt-24 md:pt-24">
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

        <div className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {chats.map((chat) => (<button key={chat.id} onClick={() => {
                onSelectChat(chat.id);
                onClose();
            }} className={`group flex w-full items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition-all duration-150
                ${activeChatId === chat.id
                ? 'border-[#d9e4ff] bg-[#edf3ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                : 'border-transparent bg-transparent hover:border-[#eef2f8] hover:bg-white/70'}
              `}>
              <div className="relative flex-shrink-0">
                <img src={chat.avatar} alt={chat.name} className="h-11 w-11 rounded-full object-cover ring-1 ring-black/5" onError={(e) => {
                const target = e.target;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=e0e7ff&color=3730a3&size=80`;
            }}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`truncate text-[15px] font-semibold tracking-[-0.01em] ${activeChatId === chat.id ? 'text-[#264fcb]' : 'text-[#25314d]'}`}>
                  {chat.name}
                </p>
                <p className="mt-1 truncate text-[13px] text-[#9aa4b7]">{chat.lastMessagePreview}</p>
              </div>
            </button>))}
        </div>
      </aside>
    </>);
}

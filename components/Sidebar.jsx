'use client';
import { SquarePen, X } from 'lucide-react';
export default function Sidebar({ chats, activeChatId, onSelectChat, isOpen, onClose }) {
    return (<>
      {isOpen && (<div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose}/>)}

      <aside className={`fixed md:relative top-0 left-0 h-full z-40 md:z-auto bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
          w-[320px] md:w-[320px] md:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
        <div className="flex items-center justify-between px-5 pt-20 pb-4 md:pt-24">
          <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <SquarePen className="w-4 h-4 text-gray-500"/>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden">
              <X className="w-4 h-4 text-gray-500"/>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {chats.map((chat) => (<button key={chat.id} onClick={() => {
                onSelectChat(chat.id);
                onClose();
            }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left group
                ${activeChatId === chat.id
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-gray-50 border border-transparent'}
              `}>
              <div className="relative flex-shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => {
                const target = e.target;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=e0e7ff&color=3730a3&size=80`;
            }}/>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-blue-700' : 'text-gray-800'}`}>
                  {chat.name}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{chat.lastMessagePreview}</p>
              </div>
            </button>))}
        </div>
      </aside>
    </>);
}

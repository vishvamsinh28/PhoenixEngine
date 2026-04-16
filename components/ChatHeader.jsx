'use client';
import { Video, Phone } from 'lucide-react';
export default function ChatHeader({ chat }) {
    return (<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" onError={(e) => {
            const target = e.target;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=e0e7ff&color=3730a3&size=80`;
        }}/>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{chat.name}</h3>
          <p className="text-xs text-gray-400">{chat.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700">
          <Video className="w-5 h-5"/>
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700">
          <Phone className="w-5 h-5"/>
        </button>
      </div>
    </div>);
}

'use client';
import { useState } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
export default function ChatInput({ onSend }) {
    const [value, setValue] = useState('');
    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed)
            return;
        onSend(trimmed);
        setValue('');
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (<div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100 flex-shrink-0">
      <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
          <Paperclip className="w-4 h-4 text-gray-400"/>
        </button>

        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"/>

        <button onClick={handleSend} disabled={!value.trim()} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${value.trim()
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            : 'bg-blue-200 text-blue-400 cursor-not-allowed'}`}>
          <ArrowUp className="w-4 h-4"/>
        </button>
      </div>
    </div>);
}

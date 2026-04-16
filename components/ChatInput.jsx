'use client';
import { useState } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
export default function ChatInput({ onSend, disabled = false, recipientName = 'Assistant' }) {
    const [value, setValue] = useState('');
    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed);
        setValue('');
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSend();
        }
    };
    return (<div className="flex-shrink-0 bg-transparent px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
      <div className={`flex items-center gap-3 rounded-[18px] border bg-white px-4 py-3 shadow-[0_10px_30px_rgba(31,42,68,0.06)] transition-all ${disabled
            ? 'border-[#e8edf5] opacity-80'
            : 'border-[#e2e8f3] focus-within:border-[#c9d8ff] focus-within:shadow-[0_16px_32px_rgba(31,42,68,0.08)]'}`}>
        <button disabled={disabled} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#e6ebf4] bg-white transition-colors enabled:hover:bg-[#f6f8fc] disabled:cursor-not-allowed disabled:bg-[#f8faff]">
          <Paperclip className="h-4 w-4 text-[#667287]"/>
        </button>

        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? `${recipientName} is replying...` : 'Type a message...'} className="flex-1 bg-transparent text-[15px] text-[#27314a] placeholder-[#a0a9bb] outline-none disabled:cursor-not-allowed"/>

        <button onClick={handleSend} disabled={disabled || !value.trim()} className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${value.trim() && !disabled
            ? 'bg-[#3f6df2] text-white shadow-[0_10px_24px_rgba(63,109,242,0.34)] hover:bg-[#2f66ea]'
            : 'bg-[#d9e6ff] text-[#7fa3f7] cursor-not-allowed'}`}>
          <ArrowUp className="h-4 w-4"/>
        </button>
      </div>
    </div>);
}

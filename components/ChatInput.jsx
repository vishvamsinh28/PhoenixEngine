'use client';
import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ChatInput({ onSend, disabled = false, projectName = 'the active project' }) {
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

    return (<div className="flex-shrink-0 border-t border-[#ecf0f8] bg-white/68 px-4 pb-4 pt-3 md:rounded-b-[28px] md:px-6 md:pb-5">
      <div className={`flex items-center gap-3 rounded-[18px] border bg-white px-3 py-3 shadow-[0_8px_22px_rgba(34,56,102,0.05)] transition-all ${disabled
            ? 'border-[#e7ebf5] opacity-75'
            : 'border-[#dbe3f4] focus-within:border-[#92b7ff] focus-within:shadow-[0_0_0_4px_rgba(77,126,242,0.10)]'}`}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? 'Computing screening result...' : `Ask a physics question about ${projectName}...`} className="flex-1 bg-transparent text-[14px] text-[#223452] placeholder-[#91a0b9] outline-none disabled:cursor-not-allowed"/>

        <button onClick={handleSend} disabled={disabled || !value.trim()} className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${value.trim() && !disabled
            ? 'bg-[linear-gradient(135deg,#3f6df2,#55baff)] text-white shadow-[0_10px_24px_rgba(63,109,242,0.27)] hover:brightness-105'
            : 'cursor-not-allowed bg-[#edf2ff] text-[#97acd6]'}`}>
          <ArrowUp className="h-4 w-4"/>
        </button>
      </div>
    </div>);
}

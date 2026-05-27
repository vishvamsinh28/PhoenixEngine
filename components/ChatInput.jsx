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

    return (<div className="flex-shrink-0 border-t border-[#142a36] bg-[#071219] px-4 pb-4 pt-3 md:px-6 md:pb-5">
      <div className={`flex items-center gap-3 rounded-[16px] border bg-[#0c1c25] px-3 py-3 transition-all ${disabled
            ? 'border-[#192e39] opacity-75'
            : 'border-[#203846] focus-within:border-[#30b8ed] focus-within:shadow-[0_0_0_3px_rgba(48,184,237,0.12)]'}`}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? 'Computing screening result...' : `Ask a physics question about ${projectName}...`} className="flex-1 bg-transparent text-[14px] text-[#dce8ed] placeholder-[#5f7885] outline-none disabled:cursor-not-allowed"/>

        <button onClick={handleSend} disabled={disabled || !value.trim()} className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${value.trim() && !disabled
            ? 'bg-[#19b5e8] text-[#03141d] shadow-[0_10px_24px_rgba(25,181,232,0.28)] hover:bg-[#43c5ef]'
            : 'cursor-not-allowed bg-[#132b36] text-[#557383]'}`}>
          <ArrowUp className="h-4 w-4"/>
        </button>
      </div>
    </div>);
}

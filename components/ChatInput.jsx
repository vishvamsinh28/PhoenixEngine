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

    return (<div className="flex-shrink-0 bg-[#111d2f]/66 px-4 pb-4 pt-3 md:rounded-b-[28px] md:px-6 md:pb-5">
      <div className={`flex items-center gap-3 rounded-[18px] border border-[#30435d]/80 bg-[#1a273a]/86 px-3 py-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.19),0_8px_22px_rgba(0,0,0,0.10)] transition-all ${disabled
            ? 'opacity-75'
            : 'focus-within:border-[#496998] focus-within:bg-[#1f2e44]/92 focus-within:shadow-[0_0_0_4px_rgba(78,126,235,0.14)]'}`}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? 'Computing screening result...' : `Ask a physics question about ${projectName}...`} className="flex-1 bg-transparent text-[14px] text-[#dbe4f2] placeholder-[#71839e] outline-none disabled:cursor-not-allowed"/>

        <button onClick={handleSend} disabled={disabled || !value.trim()} className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${value.trim() && !disabled
            ? 'bg-[linear-gradient(135deg,#3f6df2,#55baff)] text-white shadow-[0_10px_24px_rgba(63,109,242,0.27)] hover:brightness-105'
            : 'cursor-not-allowed bg-[#24344b] text-[#7b8ead]'}`}>
          <ArrowUp className="h-4 w-4"/>
        </button>
      </div>
    </div>);
}

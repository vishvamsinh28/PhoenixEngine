'use client';
import { useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';

export default function ChatInput({ onSend, onStop, isGenerating = false, isLoading = false, projectName = 'the active project' }) {
    const [value, setValue] = useState('');
    const disabled = isGenerating || isLoading;

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

    return (<div className="flex-shrink-0 bg-[#111d2f]/66 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 md:rounded-b-[28px] md:px-6 md:pb-5 md:pt-3">
      <div className={`flex items-center gap-2 rounded-[18px] border border-[#30435d]/80 bg-[#1a273a]/86 px-3 py-2.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.19),0_8px_22px_rgba(0,0,0,0.10)] transition-all md:gap-3 md:py-3 ${disabled
            ? 'opacity-75'
            : 'focus-within:border-[#496998] focus-within:bg-[#1f2e44]/92 focus-within:shadow-[0_0_0_4px_rgba(78,126,235,0.14)]'}`}>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={isGenerating ? 'Generating analysis...' : isLoading ? 'Loading conversation...' : `Ask about ${projectName}...`} className="min-w-0 flex-1 bg-transparent text-[14px] text-[#dbe4f2] placeholder-[#71839e] outline-none disabled:cursor-not-allowed"/>

        {isGenerating ? (<button type="button" title="Stop generating" onClick={onStop} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#d5566e] text-white shadow-[0_10px_24px_rgba(213,86,110,0.22)] transition hover:bg-[#e3677d] md:h-10 md:w-10">
            <Square className="h-3.5 w-3.5 fill-current"/>
          </button>) : (<button onClick={handleSend} disabled={isLoading || !value.trim()} className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all md:h-10 md:w-10 ${value.trim() && !isLoading
              ? 'bg-[linear-gradient(135deg,#3f6df2,#55baff)] text-white shadow-[0_10px_24px_rgba(63,109,242,0.27)] hover:brightness-105'
              : 'cursor-not-allowed bg-[#24344b] text-[#7b8ead]'}`}>
            <ArrowUp className="h-4 w-4"/>
          </button>)}
      </div>
    </div>);
}

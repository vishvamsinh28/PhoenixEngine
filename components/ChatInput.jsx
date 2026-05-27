'use client';
import { useRef, useState } from 'react';
import { Paperclip, ArrowUp, X, SlidersHorizontal } from 'lucide-react';

export default function ChatInput({ onSend, disabled = false, projectName = 'the active project' }) {
    const [value, setValue] = useState('');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed, attachments.map((file) => file.name));
        setValue('');
        setAttachments([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFiles = (event) => {
        setAttachments(Array.from(event.target.files || []).slice(0, 5));
    };

    return (<div className="flex-shrink-0 border-t border-[#142a36] bg-[#071219] px-4 pb-4 pt-3 md:px-6 md:pb-5">
      {attachments.length > 0 && (<div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file) => (<div key={file.name} className="flex items-center gap-2 rounded-lg border border-[#203a46] bg-[#10232d] px-3 py-1.5 text-xs text-[#a9c0ca]">
              <span>{file.name}</span>
              <button onClick={() => setAttachments((items) => items.filter((item) => item.name !== file.name))} title="Remove asset">
                <X className="h-3 w-3"/>
              </button>
            </div>))}
        </div>)}
      <div className={`flex items-center gap-3 rounded-[16px] border bg-[#0c1c25] px-3 py-3 transition-all ${disabled
            ? 'border-[#192e39] opacity-75'
            : 'border-[#203846] focus-within:border-[#30b8ed] focus-within:shadow-[0_0_0_3px_rgba(48,184,237,0.12)]'}`}>
        <input ref={fileInputRef} type="file" multiple accept=".step,.stp,.iges,.igs,.stl,.csv,.json,.vtk,.obj" onChange={handleFiles} className="hidden"/>
        <button onClick={() => fileInputRef.current?.click()} disabled={disabled} title="Attach CAD or data" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#203846] bg-[#112530] transition-colors enabled:hover:bg-[#17303d] disabled:cursor-not-allowed">
          <Paperclip className="h-4 w-4 text-[#8aa4b0]"/>
        </button>

        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? 'Computing screening result...' : `Ask a physics question about ${projectName}...`} className="flex-1 bg-transparent text-[14px] text-[#dce8ed] placeholder-[#5f7885] outline-none disabled:cursor-not-allowed"/>

        <SlidersHorizontal className="hidden h-4 w-4 text-[#557383] sm:block"/>
        <button onClick={handleSend} disabled={disabled || !value.trim()} className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${value.trim() && !disabled
            ? 'bg-[#19b5e8] text-[#03141d] shadow-[0_10px_24px_rgba(25,181,232,0.28)] hover:bg-[#43c5ef]'
            : 'cursor-not-allowed bg-[#132b36] text-[#557383]'}`}>
          <ArrowUp className="h-4 w-4"/>
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] text-[#557383]">Accepts STEP, IGES, STL, CSV, JSON, VTK and OBJ inputs for analysis context.</p>
    </div>);
}

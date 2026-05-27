'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy } from 'lucide-react';

const MarkdownResponse = dynamic(() => import('@/components/MarkdownResponse'), {
    loading: () => <p className="text-[#91a2bc]">Formatting result...</p>,
});

export default function MessageBubble({ message }) {
    const isUser = message.sender === 'user';
    const isStreamingAssistant = !isUser && !message.message;
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied)
            return;
        const timeoutId = window.setTimeout(() => setCopied(false), 1500);
        return () => window.clearTimeout(timeoutId);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.message);
            setCopied(true);
        }
        catch {
            setCopied(false);
        }
    };

    if (isUser) {
        return (<div className="flex justify-end py-3">
        <div className="max-w-[88%] md:max-w-[42rem]">
          <div className="rounded-[20px] rounded-tr-[7px] bg-[linear-gradient(135deg,#3f6df2,#529ef9)] px-5 py-3.5 text-[14px] leading-[1.5] text-white shadow-[0_12px_28px_rgba(63,109,242,0.18)] md:px-6">
            {message.message}
          </div>
        </div>
      </div>);
    }
    return (<div className="py-3">
      <div className="max-w-[95%] md:max-w-[50rem]">
        <div className="rounded-[20px] rounded-tl-[7px] border border-[#30435d]/80 bg-[#18263b]/94 px-4 py-4 text-[14px] leading-[1.6] text-[#ccd7e7] shadow-[0_12px_28px_rgba(0,0,0,0.17)] md:px-5 md:py-[18px]">
          {isStreamingAssistant ? (<div className="flex items-center gap-1.5 py-1 text-[#4f83f4]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.2s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.1s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current"/>
            </div>) : (<MarkdownResponse text={message.message}/>)}
        </div>
        {!isStreamingAssistant && (<div className="ml-1 mt-3 flex items-center gap-1.5">
            <button title={copied ? 'Copied' : 'Copy'} onClick={handleCopy} className={`rounded-lg p-1.5 transition-colors ${copied ? 'bg-[#1d304b] text-[#68a1ff]' : 'text-[#7588a5] hover:bg-[#1b293e] hover:text-[#b1c1d7]'}`}>
              {copied ? <Check className="h-[14px] w-[14px]"/> : <Copy className="h-[14px] w-[14px]"/>}
            </button>
          </div>)}
      </div>
    </div>);
}

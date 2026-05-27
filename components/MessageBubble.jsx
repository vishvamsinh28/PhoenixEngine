'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy } from 'lucide-react';

const MarkdownResponse = dynamic(() => import('@/components/MarkdownResponse'), {
    loading: () => <p className="text-[#78929e]">Formatting result...</p>,
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
          <div className="rounded-[20px] rounded-tr-[7px] border border-[#155d76] bg-[#103648] px-5 py-3.5 text-[14px] leading-[1.5] text-[#e7f5fa] shadow-[0_16px_32px_rgba(0,0,0,0.12)] md:px-6">
            {message.message}
          </div>
        </div>
      </div>);
    }
    return (<div className="py-3">
      <div className="max-w-[95%] md:max-w-[50rem]">
        <div className="rounded-[20px] rounded-tl-[7px] border border-[#162e3a] bg-[#0c1921] px-4 py-4 text-[14px] leading-[1.6] text-[#c3d5dc] shadow-[0_8px_24px_rgba(0,0,0,0.14)] md:px-5 md:py-[18px]">
          {isStreamingAssistant ? (<div className="flex items-center gap-1.5 py-1 text-[#22b7e8]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.2s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.1s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current"/>
            </div>) : (<MarkdownResponse text={message.message}/>)}
        </div>
        {!isStreamingAssistant && (<div className="ml-1 mt-3 flex items-center gap-1.5">
            <button title={copied ? 'Copied' : 'Copy'} onClick={handleCopy} className={`rounded-lg p-1.5 transition-colors ${copied ? 'bg-[#123442] text-[#22b7e8]' : 'text-[#63808d] hover:bg-[#112631] hover:text-[#bdd1d8]'}`}>
              {copied ? <Check className="h-[14px] w-[14px]"/> : <Copy className="h-[14px] w-[14px]"/>}
            </button>
          </div>)}
      </div>
    </div>);
}

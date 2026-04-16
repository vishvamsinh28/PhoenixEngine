'use client';
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MESSAGE_ACTIONS } from '@/data/uiConfig';
import IconActionButton from '@/components/IconActionButton';

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
          <div className="rounded-[24px] rounded-tr-[10px] bg-[#4a78f4] px-5 py-3.5 text-[15px] leading-[1.45] text-white shadow-[0_16px_32px_rgba(74,120,244,0.18)] md:px-6">
            {message.message}
          </div>
        </div>
      </div>);
    }
    return (<div className="py-3">
      <div className="max-w-[95%] md:max-w-[50rem]">
        <div className="rounded-[24px] rounded-tl-[10px] border border-white/70 bg-[#f3f5f9] px-4 py-4 text-[15px] leading-[1.55] text-[#2f3b55] shadow-[0_8px_24px_rgba(31,42,68,0.04)] md:px-5 md:py-[18px]">
          {isStreamingAssistant ? (<div className="flex items-center gap-1.5 py-1 text-[#7b8599]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.2s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:-0.1s]"/>
              <span className="h-2 w-2 animate-pulse rounded-full bg-current"/>
            </div>) : (message.message.split('\n\n').map((paragraph, i) => (<p key={i} className={i > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>)))}
        </div>
        {!isStreamingAssistant && (<div className="ml-1 mt-3 flex items-center gap-1.5">
            <IconActionButton icon={copied ? Check : Copy} title={copied ? 'Copied' : 'Copy'} onClick={handleCopy} active={copied} buttonClassName="p-1.5"/>
            {MESSAGE_ACTIONS.map((action) => (<IconActionButton key={action.title} icon={action.icon} title={action.title} buttonClassName="p-1.5"/>))}
          </div>)}
      </div>
    </div>);
}

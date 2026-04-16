'use client';
import { useEffect, useState } from 'react';
import { Check, Copy, Volume2, ThumbsUp, ThumbsDown, Zap, RotateCcw } from 'lucide-react';

const MESSAGE_ACTIONS = [
    { icon: Volume2, title: 'Read aloud' },
    { icon: ThumbsUp, title: 'Helpful' },
    { icon: ThumbsDown, title: 'Not helpful' },
    { icon: Zap, title: 'Quick action' },
    { icon: RotateCcw, title: 'Regenerate' },
];

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
            <ActionButton icon={copied ? Check : Copy} title={copied ? 'Copied' : 'Copy'} onClick={handleCopy} active={copied}/>
            {MESSAGE_ACTIONS.map((action) => (<ActionButton key={action.title} icon={action.icon} title={action.title}/>))}
          </div>)}
      </div>
    </div>);
}
function ActionButton({ icon: Icon, title, onClick, active = false }) {
    return (<button title={title} onClick={onClick} className={`rounded-lg p-1.5 transition-colors ${active
            ? 'bg-white text-[#2f66ea]'
            : 'text-[#6f7b91] hover:bg-white hover:text-[#1f2a44]'}`}>
      <Icon className="h-[14px] w-[14px]"/>
    </button>);
}

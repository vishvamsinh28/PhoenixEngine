'use client';
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MESSAGE_ACTIONS } from '@/data/uiConfig';
import IconActionButton from '@/components/IconActionButton';

function renderInline(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
        ? <strong key={index} className="font-semibold text-[#eaf4f7]">{part.slice(2, -2)}</strong>
        : part);
}

function FormattedResponse({ text }) {
    return text.split('\n').map((line, index) => {
        if (!line)
            return <div key={index} className="h-3"/>;
        if (line.startsWith('- '))
            return <p key={index} className="mt-1 pl-3 text-[#afc4ce] before:mr-2 before:text-[#1db7e8] before:content-['-']">{renderInline(line.slice(2))}</p>;
        return <p key={index} className={index === 0 ? '' : 'mt-1'}>{renderInline(line)}</p>;
    });
}

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
            </div>) : (<FormattedResponse text={message.message}/>)}
        </div>
        {!isStreamingAssistant && (<div className="ml-1 mt-3 flex items-center gap-1.5">
            <IconActionButton icon={copied ? Check : Copy} title={copied ? 'Copied' : 'Copy'} onClick={handleCopy} active={copied} buttonClassName="p-1.5"/>
            {MESSAGE_ACTIONS.map((action) => (<IconActionButton key={action.title} icon={action.icon} title={action.title} buttonClassName="p-1.5"/>))}
          </div>)}
      </div>
    </div>);
}

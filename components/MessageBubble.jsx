'use client';
import { Copy, Volume2, ThumbsUp, ThumbsDown, Zap, RotateCcw } from 'lucide-react';
export default function MessageBubble({ message }) {
    const isUser = message.sender === 'user';
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
          {message.message.split('\n\n').map((paragraph, i) => (<p key={i} className={i > 0 ? 'mt-4 text-[#7b8599]' : ''}>
              {paragraph}
            </p>))}
        </div>
        <div className="ml-1 mt-3 flex items-center gap-1.5">
          <ActionButton icon={Copy} title="Copy"/>
          <ActionButton icon={Volume2} title="Read aloud"/>
          <ActionButton icon={ThumbsUp} title="Helpful"/>
          <ActionButton icon={ThumbsDown} title="Not helpful"/>
          <ActionButton icon={Zap} title="Quick action"/>
          <ActionButton icon={RotateCcw} title="Regenerate"/>
        </div>
      </div>
    </div>);
}
function ActionButton({ icon: Icon, title }) {
    return (<button title={title} className="rounded-lg p-1.5 text-[#6f7b91] transition-colors hover:bg-white hover:text-[#1f2a44]">
      <Icon className="h-[14px] w-[14px]"/>
    </button>);
}

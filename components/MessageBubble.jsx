'use client';
import { Copy, Volume2, ThumbsUp, ThumbsDown, Zap, RotateCcw } from 'lucide-react';
export default function MessageBubble({ message }) {
    const isUser = message.sender === 'user';
    if (isUser) {
        return (<div className="flex justify-end px-6 py-2">
        <div className="max-w-[65%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-sm">
            {message.message}
          </div>
        </div>
      </div>);
    }
    return (<div className="px-6 py-2">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed text-gray-700 shadow-sm border border-gray-100">
          {message.message.split('\n\n').map((paragraph, i) => (<p key={i} className={i > 0 ? 'mt-3 text-gray-400' : ''}>
              {paragraph}
            </p>))}
        </div>
        <div className="flex items-center gap-1 mt-2 ml-1">
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
    return (<button title={title} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
      <Icon className="w-3.5 h-3.5"/>
    </button>);
}

'use client';

import { useEffect, useState } from 'react';
import { Download, Search, Trash2, X } from 'lucide-react';

function downloadConversation(project, messages) {
    const title = `${project.name} - Phoenix Engine Conversation`;
    const content = [
        `# ${title}`,
        '',
        `Domain: ${project.discipline}`,
        `Scope: ${project.context}`,
        '',
        ...messages.flatMap((message) => [
            `## ${message.sender === 'user' ? 'User' : 'Phoenix Engine'}`,
            '',
            message.message,
            '',
        ]),
    ].join('\n');
    const file = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-conversation.md`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function ConversationTools({ project, messages, query, onQueryChange, onClear, disabled }) {
    const [confirming, setConfirming] = useState(false);
    const hasMessages = messages.length > 0;

    useEffect(() => {
        setConfirming(false);
    }, [project.id]);

    const clear = async () => {
        const success = await onClear();
        if (success)
            setConfirming(false);
    };

    return (<div className="flex flex-wrap items-center gap-2 border-b border-[#ecf0f8] bg-white/52 px-4 py-3 md:px-6">
      <label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-[#e1e7f5] bg-white px-3 py-2 text-[#8293b0] shadow-sm md:max-w-xs">
        <Search className="h-4 w-4"/>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={!hasMessages || disabled}
          placeholder="Search saved conversation"
          className="w-full bg-transparent text-sm text-[#233452] outline-none placeholder:text-[#93a1ba] disabled:cursor-not-allowed"
        />
        {query && <button onClick={() => onQueryChange('')} title="Clear search"><X className="h-3.5 w-3.5"/></button>}
      </label>
      <button
        onClick={() => downloadConversation(project, messages)}
        disabled={!hasMessages || disabled}
        className="flex items-center gap-2 rounded-xl border border-[#e1e7f5] bg-white px-3 py-2 text-sm text-[#526482] shadow-sm transition hover:bg-[#f5f8ff] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-4 w-4"/>
        Export
      </button>
      {!confirming ? (<button
          onClick={() => setConfirming(true)}
          disabled={!hasMessages || disabled}
          className="flex items-center gap-2 rounded-xl border border-[#f1dce2] bg-white px-3 py-2 text-sm text-[#b25e70] shadow-sm transition hover:bg-[#fff5f7] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4"/>
          Clear
        </button>) : (<div className="flex items-center gap-2 rounded-xl border border-[#ffd3dc] bg-[#fff4f6] px-2 py-1.5 text-sm text-[#b34e62]">
          <span className="px-1">Delete this history?</span>
          <button onClick={clear} className="rounded-md bg-[#d5566e] px-2.5 py-1 text-white hover:bg-[#be445b]">Delete</button>
          <button onClick={() => setConfirming(false)} className="rounded-md px-2 py-1 hover:bg-[#ffe8ed]">Cancel</button>
        </div>)}
    </div>);
}

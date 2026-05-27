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

    return (<div className="flex flex-wrap items-center gap-2 bg-[#131f32]/48 px-4 py-3 md:px-6">
      <label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl bg-[#1b283c]/80 px-3 py-2 text-[#8193b0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] md:max-w-xs">
        <Search className="h-4 w-4"/>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={!hasMessages || disabled}
          placeholder="Search saved conversation"
          className="w-full bg-transparent text-sm text-[#d3ddec] outline-none placeholder:text-[#6f819e] disabled:cursor-not-allowed"
        />
        {query && <button onClick={() => onQueryChange('')} title="Clear search"><X className="h-3.5 w-3.5"/></button>}
      </label>
      <button
        onClick={() => downloadConversation(project, messages)}
        disabled={!hasMessages || disabled}
        className="flex items-center gap-2 rounded-xl bg-[#1c293d]/78 px-3 py-2 text-sm text-[#bbc8db] shadow-[0_5px_14px_rgba(0,0,0,0.12)] transition hover:bg-[#223249] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-4 w-4"/>
        Export
      </button>
      {!confirming ? (<button
          onClick={() => setConfirming(true)}
          disabled={!hasMessages || disabled}
          className="flex items-center gap-2 rounded-xl bg-[#302332]/76 px-3 py-2 text-sm text-[#e39cab] shadow-[0_5px_14px_rgba(0,0,0,0.13)] transition hover:bg-[#3b2938] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4"/>
          Clear
        </button>) : (<div className="flex items-center gap-2 rounded-xl bg-[#382332]/90 px-2 py-1.5 text-sm text-[#f0a4b5] shadow-sm">
          <span className="px-1">Delete this history?</span>
          <button onClick={clear} className="rounded-md bg-[#d5566e] px-2.5 py-1 text-white hover:bg-[#be445b]">Delete</button>
          <button onClick={() => setConfirming(false)} className="rounded-md px-2 py-1 hover:bg-[#4a2e3c]">Cancel</button>
        </div>)}
    </div>);
}

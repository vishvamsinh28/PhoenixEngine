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

    return (<div className="flex flex-wrap items-center gap-2 border-b border-[#142a36] bg-[#08151c] px-4 py-3 md:px-6">
      <label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-lg border border-[#1c3440] bg-[#0b1b23] px-3 py-2 text-[#68838f] md:max-w-xs">
        <Search className="h-4 w-4"/>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={!hasMessages || disabled}
          placeholder="Search saved conversation"
          className="w-full bg-transparent text-sm text-[#cfdee4] outline-none placeholder:text-[#607985] disabled:cursor-not-allowed"
        />
        {query && <button onClick={() => onQueryChange('')} title="Clear search"><X className="h-3.5 w-3.5"/></button>}
      </label>
      <button
        onClick={() => downloadConversation(project, messages)}
        disabled={!hasMessages || disabled}
        className="flex items-center gap-2 rounded-lg border border-[#1c3440] px-3 py-2 text-sm text-[#b6cad2] hover:bg-[#10242e] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-4 w-4"/>
        Export
      </button>
      {!confirming ? (<button
          onClick={() => setConfirming(true)}
          disabled={!hasMessages || disabled}
          className="flex items-center gap-2 rounded-lg border border-[#362b30] px-3 py-2 text-sm text-[#dc999c] hover:bg-[#21171b] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4"/>
          Clear
        </button>) : (<div className="flex items-center gap-2 rounded-lg border border-[#63343a] bg-[#22171b] px-2 py-1.5 text-sm text-[#eda7ab]">
          <span className="px-1">Delete this history?</span>
          <button onClick={clear} className="rounded-md bg-[#7c333b] px-2.5 py-1 text-white hover:bg-[#94414a]">Delete</button>
          <button onClick={() => setConfirming(false)} className="rounded-md px-2 py-1 hover:bg-[#302026]">Cancel</button>
        </div>)}
    </div>);
}

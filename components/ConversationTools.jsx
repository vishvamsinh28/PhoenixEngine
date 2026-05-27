'use client';

import { useEffect, useState } from 'react';
import { Download, Search, Trash2, X } from 'lucide-react';

const PDF_PAGE = {
    width: 612,
    height: 792,
    margin: 48,
    lineHeight: 15,
};

function sanitizePdfText(text) {
    return String(text || '')
        .normalize('NFKD')
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
        .replace(/\s+\n/g, '\n')
        .trim();
}

function escapePdfText(text) {
    return sanitizePdfText(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function formatPdfText(text) {
    return String(text || '')
        .replace(/\r\n/g, '\n')
        .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-zA-Z]*\n?|```/g, ''))
        .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
        .replace(/\$([^$\n]+)\$/g, '$1')
        .split('\n')
        .map((line) => line
            .replace(/^#{1,6}\s+/, '')
            .replace(/^\s*[-*+]\s+/, '- ')
            .replace(/^\s*>+\s?/, '')
            .replace(/^\s*---+\s*$/, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\$/g, '')
            .replace(/\\times/g, 'x')
            .replace(/\\cdot/g, 'x')
            .replace(/\\theta/g, 'theta')
            .replace(/\\Delta/g, 'Delta')
            .replace(/\\[a-zA-Z]+/g, '')
            .replace(/[{}]/g, '')
            .replace(/\s+/g, ' ')
            .trim())
        .filter((line, index, lines) => line || lines[index - 1])
        .join('\n')
        .trim();
}

function wrapPdfLine(text, maxCharacters = 86) {
    const words = sanitizePdfText(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';

    words.forEach((word) => {
        if (word.length > maxCharacters) {
            if (line) {
                lines.push(line);
                line = '';
            }
            for (let index = 0; index < word.length; index += maxCharacters) {
                lines.push(word.slice(index, index + maxCharacters));
            }
            return;
        }

        const nextLine = line ? `${line} ${word}` : word;

        if (nextLine.length > maxCharacters) {
            lines.push(line);
            line = word;
        } else {
            line = nextLine;
        }
    });

    if (line) {
        lines.push(line);
    }

    return lines.length ? lines : [''];
}

function buildConversationLines(project, messages) {
    const title = `${project.name} - Phoenix Engine Conversation`;

    return [
        { text: title, size: 16 },
        { text: `Generated: ${new Date().toLocaleString()}`, size: 9 },
        { text: `Domain: ${project.discipline}`, size: 10 },
        { text: `Scope: ${project.context}`, size: 10 },
        { text: '', size: 8 },
        ...messages.flatMap((message) => [
            { text: message.sender === 'user' ? 'User' : 'Phoenix Engine', size: 12 },
            ...formatPdfText(message.message).split('\n').flatMap((line) => wrapPdfLine(line).map((text) => ({ text, size: 10 }))),
            { text: '', size: 8 },
        ]),
    ];
}

function createConversationPdf(project, messages) {
    const maxY = PDF_PAGE.margin;
    let currentPage = [];
    let currentY = PDF_PAGE.height - PDF_PAGE.margin;
    const pages = [];

    buildConversationLines(project, messages).forEach((line) => {
        if (currentY < maxY) {
            pages.push(currentPage);
            currentPage = [];
            currentY = PDF_PAGE.height - PDF_PAGE.margin;
        }

        currentPage.push({ ...line, y: currentY });
        currentY -= line.text ? PDF_PAGE.lineHeight : PDF_PAGE.lineHeight * 0.65;
    });

    if (currentPage.length) {
        pages.push(currentPage);
    }

    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        `<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    ];

    pages.forEach((pageLines, index) => {
        const pageObjectNumber = 3 + index * 2;
        const contentObjectNumber = pageObjectNumber + 1;
        const contentLines = pageLines.map((line) => {
            const font = line.size >= 12 ? '/F2' : '/F1';
            return `${font} ${line.size} Tf 1 0 0 1 ${PDF_PAGE.margin} ${line.y} Tm (${escapePdfText(line.text)}) Tj`;
        });
        const content = ['BT', ...contentLines, 'ET'].join('\n');

        objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE.width} ${PDF_PAGE.height}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentObjectNumber} 0 R >>`);
        objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    });

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
}

function downloadConversation(project, messages) {
    const file = createConversationPdf(project, messages);
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-conversation.pdf`;
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
        Export PDF
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

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function MarkdownResponse({ text }) {
    return (<ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
          h1: ({ children }) => <h1 className="mb-3 mt-1 text-lg font-semibold text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-semibold text-white first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#58cef3] first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-[#edf6f8]">{children}</strong>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[#1db7e8]">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[#1db7e8]">{children}</ol>,
          li: ({ children }) => <li className="pl-1 text-[#b8cbd3]">{children}</li>,
          table: ({ children }) => <div className="my-3 overflow-x-auto"><table className="min-w-full border-collapse text-xs">{children}</table></div>,
          th: ({ children }) => <th className="border border-[#29404c] bg-[#11252f] px-3 py-2 text-left text-[#e5f1f5]">{children}</th>,
          td: ({ children }) => <td className="border border-[#203743] px-3 py-2 text-[#afc4ce]">{children}</td>,
          code: ({ children }) => <code className="rounded bg-[#122a35] px-1.5 py-0.5 text-[13px] text-[#72d8f7]">{children}</code>,
          pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-xl border border-[#1c3440] bg-[#09141b] p-3">{children}</pre>,
          a: ({ href, children }) => <a className="text-[#48c9f1] underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{children}</a>,
          blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-[#22b7e8] pl-4 text-[#9eb4be]">{children}</blockquote>,
      }}
    >
      {text}
    </ReactMarkdown>);
}

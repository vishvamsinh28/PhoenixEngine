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
          h1: ({ children }) => <h1 className="mb-3 mt-1 text-lg font-semibold text-[#eef3fb]">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-semibold text-[#eef3fb] first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#72a5ff] first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-[#eef3fb]">{children}</strong>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[#68a0ff]">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[#68a0ff]">{children}</ol>,
          li: ({ children }) => <li className="pl-1 text-[#d0daea]">{children}</li>,
          table: ({ children }) => <div className="my-3 overflow-hidden rounded-xl bg-[#111c2d]/72"><table className="min-w-full border-separate border-spacing-[1px] text-xs">{children}</table></div>,
          th: ({ children }) => <th className="bg-[#23334a]/90 px-3 py-2 text-left text-[#ecf2fa]">{children}</th>,
          td: ({ children }) => <td className="bg-[#1b293c]/72 px-3 py-2 text-[#c6d2e4]">{children}</td>,
          code: ({ children }) => <code className="rounded bg-[#233550]/80 px-1.5 py-0.5 text-[13px] text-[#86b4ff]">{children}</code>,
          pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-xl bg-[#111c2c]/86 p-3">{children}</pre>,
          a: ({ href, children }) => <a className="text-[#83b4ff] underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{children}</a>,
          blockquote: ({ children }) => <blockquote className="my-3 rounded-r-lg bg-[#202f45]/72 py-2 pl-4 text-[#b8c6da] shadow-[inset_3px_0_0_#567fe4]">{children}</blockquote>,
      }}
    >
      {text}
    </ReactMarkdown>);
}

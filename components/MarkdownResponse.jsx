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
          h1: ({ children }) => <h1 className="mb-3 mt-1 text-lg font-semibold text-[#162643]">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-semibold text-[#162643] first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#356cef] first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-[#1f304d]">{children}</strong>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[#4d7ff4]">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[#4d7ff4]">{children}</ol>,
          li: ({ children }) => <li className="pl-1 text-[#3d4f6c]">{children}</li>,
          table: ({ children }) => <div className="my-3 overflow-x-auto"><table className="min-w-full border-collapse text-xs">{children}</table></div>,
          th: ({ children }) => <th className="border border-[#dfe6f5] bg-[#f1f5ff] px-3 py-2 text-left text-[#1e304d]">{children}</th>,
          td: ({ children }) => <td className="border border-[#e4eaf6] px-3 py-2 text-[#435471]">{children}</td>,
          code: ({ children }) => <code className="rounded bg-[#edf3ff] px-1.5 py-0.5 text-[13px] text-[#386cf0]">{children}</code>,
          pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-xl border border-[#dfe6f6] bg-[#f5f8ff] p-3">{children}</pre>,
          a: ({ href, children }) => <a className="text-[#356cf0] underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{children}</a>,
          blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-[#5e8cf4] pl-4 text-[#596b88]">{children}</blockquote>,
      }}
    >
      {text}
    </ReactMarkdown>);
}

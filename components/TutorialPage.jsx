'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Box, Gauge, HelpCircle, MessageSquareText, Search, Sparkles } from 'lucide-react';

import { allPages, beginnerQuestions, domainPages, extraExamplesByPage, toolPages } from '@/data/tutorialContent';

function GuidePanel({ title, items, tone = 'default' }) {
  const warning = tone === 'warning';
  return (
    <article className={`rounded-lg border p-4 ${warning ? 'border-[#5a4620] bg-[#2b2416]/86' : 'border-[#263a55] bg-[#172438]/72'}`}>
      <h3 className={`text-sm font-semibold ${warning ? 'text-[#f5bd73]' : 'text-[#edf3fb]'}`}>{title}</h3>
      <ol className={`mt-3 list-decimal space-y-2 pl-4 text-xs leading-5 ${warning ? 'text-[#d9c39a]' : 'text-[#91a3bd]'}`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ol>
    </article>
  );
}

function GuideTable({ title, rows }) {
  return (
    <article className="rounded-lg border border-[#263a55] bg-[#172438]/72 p-4">
      <h3 className="text-sm font-semibold text-[#edf3fb]">{title}</h3>
      <div className="mt-3 space-y-2">
        {rows.map(([label, text]) => (
          <div key={label} className="rounded-lg bg-[#121e31]/76 p-3">
            <p className="text-xs font-semibold text-[#dce8f7]">{label}</p>
            <p className="mt-1 text-xs leading-5 text-[#91a3bd]">{text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ExampleCard({ example }) {
  return (
    <article className="rounded-lg border border-[#263a55] bg-[#172438]/72 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#789ee8]">Example</p>
      <h3 className="mt-2 text-base font-semibold text-[#edf3fb]">{example.title}</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {example.values.map(([label, value]) => (
          <div key={`${example.title}-${label}`} className="flex items-center justify-between gap-3 rounded-lg bg-[#121e31]/76 px-3 py-2 text-xs">
            <span className="text-[#879ab6]">{label}</span>
            <span className="font-medium text-[#e0e9f6]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-[#2b405d] bg-[#121e31]/80 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#789ee8]">Ask this</p>
        <p className="mt-2 text-xs leading-5 text-[#d1dced]">{example.prompt}</p>
      </div>
    </article>
  );
}

export default function TutorialPage({ onOpenWorkbench, onOpenSimulations }) {
  const [activePageId, setActivePageId] = useState('start');
  const activePage = useMemo(() => allPages.find((page) => page.id === activePageId) || allPages[0], [activePageId]);
  const examples = useMemo(
    () => [activePage.example, ...(extraExamplesByPage[activePage.id] || [])],
    [activePage],
  );
  const ActiveIcon = activePage.Icon;
  const isDomainPage = domainPages.some((page) => page.id === activePage.id);

  return (
    <section className="flex min-h-full w-full flex-col bg-[#111b2c] pb-8 lg:grid lg:grid-cols-[228px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-[#273c58]/70 bg-[#111b2c] p-4 lg:sticky lg:top-0 lg:max-h-[calc(100dvh-5.5rem)] lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">
              <BookOpen className="h-4 w-4" />
              Tutorial
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">Learning hub</h2>
          </div>
          <p className="text-xs text-[#8193b0] lg:hidden">Swipe sections</p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7285a4]">Tools</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
            {toolPages.map(({ id, label, Icon }) => (
              <button key={id} type="button" onClick={() => setActivePageId(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition lg:w-full ${activePageId === id ? 'bg-[#244064] text-[#edf3fb]' : 'bg-[#152238] text-[#91a3bd] hover:bg-[#1a2a40] hover:text-[#dce7f5] lg:bg-transparent'}`}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7285a4]">Physics</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
            {domainPages.map(({ id, label, Icon }) => (
              <button key={id} type="button" onClick={() => setActivePageId(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition lg:w-full ${activePageId === id ? 'bg-[#244064] text-[#edf3fb]' : 'bg-[#152238] text-[#91a3bd] hover:bg-[#1a2a40] hover:text-[#dce7f5] lg:bg-transparent'}`}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="min-w-0 bg-[#111b2c]">
        <div className="border-b border-[#273c58]/70 bg-[#111b2c] px-4 py-5 md:px-7 md:py-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">
                <ActiveIcon className="h-4 w-4" />
                {isDomainPage ? 'Physics concept' : 'Tool guide'}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#eaf0fa] md:text-3xl">{activePage.title}</h1>
              <p className="mt-3 text-sm leading-7 text-[#a7b6ce]">{activePage.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onOpenWorkbench} className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-4 py-2 text-sm font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)]">
                Workbench
                <ArrowRight className="h-4 w-4" />
              </button>
              {onOpenSimulations && (
                <button type="button" onClick={onOpenSimulations} className="inline-flex items-center gap-2 rounded-lg border border-[#365277] bg-[#1b2d45]/86 px-4 py-2 text-sm font-medium text-[#dce8f7] transition hover:bg-[#243a58]">
                  Simulations
                  <Box className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-4 py-5 md:px-7">
          <div className="space-y-4">
            {activePage.steps && (
              <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                  <Sparkles className="h-4 w-4" />
                  How to use it
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {activePage.steps.map(([title, text], index) => (
                    <div key={title} className="grid grid-cols-[32px_1fr] gap-3 rounded-lg bg-[#172438]/72 p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d3048] text-sm font-semibold text-[#9dc5ff]">{index + 1}</span>
                      <span>
                        <span className="block text-sm font-semibold text-[#edf3fb]">{title}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#92a4be]">{text}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activePage.equation && (
              <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                  <Gauge className="h-4 w-4" />
                  Main idea
                </div>
                <p className="mt-4 rounded-lg bg-[#172438]/72 px-4 py-3 text-sm font-semibold text-[#edf3fb]">{activePage.equation}</p>
              </section>
            )}

            {activePage.beginnerGuide && (
              <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                  <BookOpen className="h-4 w-4" />
                  Beginner physics walkthrough
                </div>
                <div className="mt-4 rounded-lg bg-[#172438]/72 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8fb6f4]">Mental model</p>
                  <p className="mt-2 text-sm leading-7 text-[#d1dced]">{activePage.beginnerGuide.mentalModel}</p>
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <GuidePanel title="What is happening physically" items={activePage.beginnerGuide.whatHappens} />
                  <GuideTable title="Inputs rookies should understand" rows={activePage.beginnerGuide.inputGuide} />
                  <GuideTable title="How to read outputs" rows={activePage.beginnerGuide.outputGuide} />
                  <GuidePanel title="Common beginner mistakes" items={activePage.beginnerGuide.mistakes} tone="warning" />
                </div>
              </section>
            )}

            <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                <HelpCircle className="h-4 w-4" />
                Concepts in plain English
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {activePage.concepts.map(([title, text]) => (
                  <article key={title} className="rounded-lg bg-[#172438]/72 p-4">
                    <h3 className="text-sm font-semibold text-[#edf3fb]">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#91a3bd]">{text}</p>
                  </article>
                ))}
              </div>
            </section>

            {activePage.useWhen && (
              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Use when</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-5 text-[#91a3bd]">
                    {activePage.useWhen.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-[#5a4620] bg-[#2b2416]/86 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f5bd73]">Limits</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-5 text-[#d9c39a]">
                    {activePage.limitations.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </section>
            )}
          </div>

          <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Worked examples</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {examples.map((example) => <ExampleCard key={example.title} example={example} />)}
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                <MessageSquareText className="h-4 w-4" />
                Good beginner questions
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {beginnerQuestions.map((question) => (
                  <p key={question} className="rounded-lg bg-[#172438]/72 px-3 py-2 text-xs leading-5 text-[#c8d5e7]">{question}</p>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-[#263a55] bg-[#121e31]/76 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                <Search className="h-4 w-4" />
                Rule of thumb
              </div>
              <p className="mt-3 text-xs leading-6 text-[#91a3bd]">
                If a number decides safety, cost, or manufacturing quality, use Phoenix to screen the idea, then validate with test data, CFD/FEA, supplier data, or process measurements.
              </p>
            </section>
          </div>
        </div>
      </main>
    </section>
  );
}

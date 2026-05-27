'use client';

import {
  ArrowRight,
  BarChart3,
  Cpu,
  Droplets,
  Hexagon,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Wind,
} from 'lucide-react';

const domains = [
  {
    name: 'Thermal Analysis',
    detail: 'Electronics cooling, airflow, heat transfer, and thermal resistance.',
    Icon: ThermometerSun,
    accent: '#f97316',
  },
  {
    name: 'Aerodynamics',
    detail: 'Lift, drag, pressure behavior, and external-flow force checks.',
    Icon: Wind,
    accent: '#38bdf8',
  },
  {
    name: 'Battery Cooling',
    detail: 'Liquid-loop screening, coolant rise, and pressure-drop tradeoffs.',
    Icon: Droplets,
    accent: '#34d399',
  },
  {
    name: 'Process Modeling',
    detail: 'Deposition uniformity, sensitivity analysis, and process margins.',
    Icon: Layers3,
    accent: '#a78bfa',
  },
];

const stats = [
  { value: '4', label: 'engineering workbenches' },
  { value: 'AI', label: 'guided interpretation' },
  { value: 'Saved', label: 'runs and conversations' },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_78%_14%,rgba(48,98,185,0.24),transparent_30%),radial-gradient(circle_at_13%_78%,rgba(30,119,107,0.16),transparent_28%),linear-gradient(132deg,#0b1421,#101a2b_50%,#0b2230)] text-[#d9e2f1]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#346cf3,#63c5ff)] text-white shadow-[0_10px_24px_rgba(50,105,242,0.25)]">
            <Hexagon className="h-8 w-8" />
            <Cpu className="absolute h-4 w-4" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-[-0.03em] text-[#eef5ff]">Phoenix Engine</p>
            <p className="hidden text-xs font-medium text-[#8798b4] sm:block">Engineering intelligence workspace</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGetStarted}
          className="rounded-xl border border-[#355171] bg-[#162337]/78 px-4 py-2.5 text-sm font-semibold text-[#dce8f8] shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition hover:border-[#4b78b3] hover:bg-[#1d2d44]"
        >
          Sign in
        </button>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-7 md:min-h-[calc(100vh-84px)] md:grid-cols-[0.98fr_1.02fr] md:px-8 md:pb-20 md:pt-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#2d4564] bg-[#111d2e]/78 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8fb7ff]">
            <Sparkles className="h-4 w-4" />
            Analysis before simulation
          </p>

          <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#f1f6fd] sm:text-5xl lg:text-6xl">
            Phoenix Engine
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#a8b7cf] md:text-lg">
            A focused workspace for engineering screening runs, saved technical conversations, and AI-assisted interpretation across thermal, flow, battery, and process modeling problems.
          </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3f6df2,#56baff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(63,109,242,0.24)] transition hover:brightness-110"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center rounded-xl border border-[#324a69] bg-[#111d2e]/72 px-5 py-3 text-sm font-semibold text-[#d8e4f4] transition hover:border-[#52759d] hover:bg-[#17263a]"
            >
              Explore capabilities
            </a>
            <a
              href="#method"
              className="inline-flex items-center justify-center rounded-xl border border-[#324a69] bg-[#111d2e]/72 px-5 py-3 text-sm font-semibold text-[#d8e4f4] transition hover:border-[#52759d] hover:bg-[#17263a]"
            >
              How it works
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-[#2d4564] pl-4">
                <dt className="text-lg font-semibold text-[#f1f6fd]">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-[#8fa1bb]">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-[#38bdf8]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-[#29405d] bg-[#121e31]/82 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#263a55] px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#edf3fb]">Thermal Analysis</p>
                <p className="mt-1 text-xs text-[#8798b4]">Electronics cooling screening</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d3048] text-[#77aaff]">
                <ThermometerSun className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                {['Heat load', 'Ambient temp', 'Airflow', 'Sink resistance'].map((label, index) => (
                  <div key={label} className="rounded-xl border border-[#263a55] bg-[#18253a] p-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-[#9fb0c9]">{label}</span>
                      <span className="text-sm font-semibold text-[#edf3fb]">{[320, 35, 18, 0.22][index]}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#243750]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#4f7cf5,#58c7ff)]"
                        style={{ width: `${[74, 48, 62, 38][index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#263a55] bg-[#0f1a2a] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8fb7ff]">
                  <BarChart3 className="h-4 w-4" />
                  Screening result
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#899bb5]">Junction temp</p>
                    <p className="mt-1 text-2xl font-semibold text-[#f4f8ff]">78.4 C</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#899bb5]">Margin</p>
                    <p className="mt-1 text-2xl font-semibold text-[#71e1b1]">+16.6 C</p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl bg-[#152236] p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-[#65c6ff]" />
                    <p className="text-sm leading-6 text-[#b4c4da]">
                      Phoenix can explain the run, flag assumptions, and suggest the next validation step.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#8fa1bb]">
                  <ShieldCheck className="h-4 w-4 text-[#6de1b0]" />
                  Runs and conversations stay tied to your account.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-t border-[#263a55]/80 bg-[#0d1726]/74 px-5 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8fb7ff]">What it covers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#edf3fb]">Built for early engineering decisions</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {domains.map(({ name, detail, Icon, accent }) => (
              <article key={name} className="rounded-[18px] border border-[#263a55] bg-[#121e31]/82 p-5 shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1b2b42]" style={{ color: accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#edf3fb]">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9aacc5]">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="border-t border-[#263a55]/80 bg-[#101a2b]/82 px-5 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8fb7ff]">Method and trust</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#edf3fb]">Built to separate calculations from interpretation</h2>
            <p className="mt-4 text-sm leading-7 text-[#9aacc5]">
              Phoenix runs deterministic screening models first, then uses AI to help explain the result, challenge assumptions, and plan the next validation step.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Validated inputs', 'Each workbench checks numeric ranges and flags suspicious operating conditions before a run is saved.'],
              ['Saved evidence', 'Runs, assumptions, sensitivity sweeps, and conversations stay attached to your account.'],
              ['Report export', 'Engineering notes can be exported with inputs, outputs, assumptions, and transparency details.'],
              ['Known limits', 'Every model exposes what it does and does not calculate, so results stay in context.'],
            ].map(([title, detail]) => (
              <article key={title} className="rounded-[18px] border border-[#263a55] bg-[#121e31]/82 p-5 shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
                <h3 className="text-base font-semibold text-[#edf3fb]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9aacc5]">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

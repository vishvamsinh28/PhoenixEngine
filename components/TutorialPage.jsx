'use client';

import { ArrowRight, BarChart3, BookOpen, Download, HelpCircle, MessageSquareText, Search, Sparkles } from 'lucide-react';

const workflowSteps = [
  {
    title: 'Pick a domain',
    text: 'Choose the engineering area that is closest to your problem. Thermal is for heat, Aerodynamics is for air forces, Battery Cooling is for liquid coolant, and Process Modeling is for wafer thickness uniformity.',
  },
  {
    title: 'Run the calculator',
    text: 'The input panel is the serious math part. Put in numbers, press Run screening, and Phoenix saves the result to your account.',
  },
  {
    title: 'Ask in plain English',
    text: 'Use chat to understand what the numbers mean, what looks risky, and what you should try next.',
  },
  {
    title: 'Export the conversation',
    text: 'When the explanation is useful, export the conversation as a PDF so you can share or keep the reasoning.',
  },
];

const examples = [
  {
    title: 'Thermal Analysis',
    scenario: 'Small electronics enclosure',
    plain: 'A compact inverter or controller with moderate airflow.',
    values: [
      ['Heat load', '75 W'],
      ['Effective area', '250 cm2'],
      ['Path thickness', '2 mm'],
      ['Conductivity', '205 W/mK'],
      ['Interface resistance', '0.15 K/W'],
      ['Convection h', '45 W/m2K'],
      ['Ambient', '25 C'],
      ['Max temperature', '90 C'],
    ],
    question: 'My predicted temperature is close to the limit. Explain the result like I am new to thermal design and tell me the easiest change to improve margin.',
  },
  {
    title: 'Thermal Analysis',
    scenario: 'Hot power module',
    plain: 'A higher-power component with a smaller cooling path.',
    values: [
      ['Heat load', '140 W'],
      ['Effective area', '180 cm2'],
      ['Path thickness', '3 mm'],
      ['Conductivity', '205 W/mK'],
      ['Interface resistance', '0.22 K/W'],
      ['Convection h', '60 W/m2K'],
      ['Ambient', '35 C'],
      ['Max temperature', '100 C'],
    ],
    question: 'This power module is running hot. Which input is hurting me most: heat load, interface resistance, area, or airflow?',
  },
  {
    title: 'Thermal Analysis',
    scenario: 'Natural convection check',
    plain: 'A sealed or quiet device with weak airflow.',
    values: [
      ['Heat load', '30 W'],
      ['Effective area', '300 cm2'],
      ['Path thickness', '2.5 mm'],
      ['Conductivity', '150 W/mK'],
      ['Interface resistance', '0.18 K/W'],
      ['Convection h', '8 W/m2K'],
      ['Ambient', '28 C'],
      ['Max temperature', '85 C'],
    ],
    question: 'Explain why low convection h makes this risky. What practical cooling changes should I try first?',
  },
  {
    title: 'Aerodynamics',
    scenario: 'Small vehicle fairing',
    plain: 'Airflow around a body panel or fairing at road speed.',
    values: [
      ['Velocity', '30 m/s'],
      ['Air density', '1.225 kg/m3'],
      ['Viscosity', '0.0000181 Pa s'],
      ['Reference area', '0.45 m2'],
      ['Length scale', '0.8 m'],
      ['Drag coefficient', '0.32'],
      ['Lift coefficient', '0.1'],
      ['Drag limit', '100 N'],
    ],
    question: 'Explain drag, lift, dynamic pressure, and Reynolds number from this run in simple words. What should I verify before trusting it?',
  },
  {
    title: 'Aerodynamics',
    scenario: 'Higher-speed drag limit',
    plain: 'A faster case where drag grows quickly.',
    values: [
      ['Velocity', '55 m/s'],
      ['Air density', '1.225 kg/m3'],
      ['Viscosity', '0.0000181 Pa s'],
      ['Reference area', '0.62 m2'],
      ['Length scale', '1.2 m'],
      ['Drag coefficient', '0.38'],
      ['Lift coefficient', '0.05'],
      ['Drag limit', '350 N'],
    ],
    question: 'Why did drag increase so much at this speed? Explain the velocity effect and whether the drag limit is comfortable.',
  },
  {
    title: 'Aerodynamics',
    scenario: 'Winglet lift check',
    plain: 'A quick force estimate for a lifting surface.',
    values: [
      ['Velocity', '22 m/s'],
      ['Air density', '1.18 kg/m3'],
      ['Viscosity', '0.0000185 Pa s'],
      ['Reference area', '0.28 m2'],
      ['Length scale', '0.55 m'],
      ['Drag coefficient', '0.12'],
      ['Lift coefficient', '0.65'],
      ['Drag limit', '80 N'],
    ],
    question: 'Explain whether this looks more lift-focused or drag-focused, and what wind-tunnel or CFD data I would need next.',
  },
  {
    title: 'Battery Cooling',
    scenario: 'Baseline cold plate',
    plain: 'A normal liquid loop with water-like coolant.',
    values: [
      ['Heat load', '1200 W'],
      ['Total flow', '6 L/min'],
      ['Inlet temperature', '25 C'],
      ['Outlet limit', '35 C'],
      ['Coolant density', '997 kg/m3'],
      ['Coolant Cp', '4180 J/kgK'],
      ['Viscosity', '0.00089 Pa s'],
      ['Channel size', '8 mm x 3 mm'],
      ['Channels', '10 parallel'],
    ],
    question: 'Is this cooling loop good enough? Explain outlet temperature, pressure drop, and what a pump would need to handle.',
  },
  {
    title: 'Battery Cooling',
    scenario: 'Low-flow warning case',
    plain: 'Same kind of pack, but the pump flow is limited.',
    values: [
      ['Heat load', '1000 W'],
      ['Total flow', '2.5 L/min'],
      ['Inlet temperature', '30 C'],
      ['Outlet limit', '40 C'],
      ['Coolant density', '997 kg/m3'],
      ['Coolant Cp', '4180 J/kgK'],
      ['Viscosity', '0.00089 Pa s'],
      ['Channel size', '7 mm x 2.5 mm'],
      ['Channels', '8 parallel'],
    ],
    question: 'Explain if this low-flow case is risky. Should I increase flow, add channels, or reduce heat load first?',
  },
  {
    title: 'Battery Cooling',
    scenario: 'High-power fast charge',
    plain: 'A stressful case with more heat and more flow.',
    values: [
      ['Heat load', '2200 W'],
      ['Total flow', '10 L/min'],
      ['Inlet temperature', '25 C'],
      ['Outlet limit', '38 C'],
      ['Coolant density', '1030 kg/m3'],
      ['Coolant Cp', '3600 J/kgK'],
      ['Viscosity', '0.0015 Pa s'],
      ['Channel size', '10 mm x 3 mm'],
      ['Channels', '14 parallel'],
    ],
    question: 'For this fast-charge case, explain the tradeoff between cooler outlet temperature and pressure drop.',
  },
  {
    title: 'Process Modeling',
    scenario: 'Mild edge cooling',
    plain: 'A wafer where the edge is slightly cooler than the center.',
    values: [
      ['Center rate', '10 nm/min'],
      ['Center temperature', '400 C'],
      ['Edge temperature', '395 C'],
      ['Activation energy', '45 kJ/mol'],
      ['Process time', '10 min'],
      ['Target thickness', '100 nm'],
      ['Uniformity limit', '5%'],
    ],
    question: 'Explain why a 5 C edge temperature drop changes thickness. What should I tune first to improve uniformity?',
  },
  {
    title: 'Process Modeling',
    scenario: 'Large temperature mismatch',
    plain: 'A stronger center-to-edge temperature difference.',
    values: [
      ['Center rate', '12 nm/min'],
      ['Center temperature', '420 C'],
      ['Edge temperature', '405 C'],
      ['Activation energy', '55 kJ/mol'],
      ['Process time', '8 min'],
      ['Target thickness', '95 nm'],
      ['Uniformity limit', '4%'],
    ],
    question: 'This wafer has a large temperature mismatch. Explain how temperature sensitivity affects edge thickness and uniformity.',
  },
  {
    title: 'Process Modeling',
    scenario: 'Slower low-temperature process',
    plain: 'A gentler recipe with longer process time.',
    values: [
      ['Center rate', '6 nm/min'],
      ['Center temperature', '350 C'],
      ['Edge temperature', '348 C'],
      ['Activation energy', '35 kJ/mol'],
      ['Process time', '18 min'],
      ['Target thickness', '110 nm'],
      ['Uniformity limit', '3%'],
    ],
    question: 'Explain whether this slower recipe is more forgiving. What should I watch if I care about thickness target and uniformity?',
  },
];

const featureCards = [
  {
    Icon: BarChart3,
    title: 'Workbench',
    text: 'This is where you enter values and run deterministic screening models. These calculations are not guesses from chat.',
  },
  {
    Icon: MessageSquareText,
    title: 'Chat',
    text: 'This is where you ask for interpretation, next steps, tradeoffs, and beginner-friendly explanations.',
  },
  {
    Icon: Search,
    title: 'Search',
    text: 'Use search to find older answers inside the saved conversation for the active project.',
  },
  {
    Icon: Download,
    title: 'PDF Export',
    text: 'Download the saved conversation as a readable report when you want to keep the explanation.',
  },
];

export default function TutorialPage({ onOpenWorkbench }) {
  return (
    <section className="mx-auto w-full max-w-7xl pb-10">
      <div className="border-b border-[#273c58]/80 bg-[#121e31]/70 px-4 py-6 md:px-7 md:py-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">
              <BookOpen className="h-4 w-4" />
              Tutorial
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#eaf0fa] md:text-3xl">
              Phoenix Engine, without the physics headache
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#a7b6ce]">
              Think of Phoenix as two tools in one: a calculator for quick engineering estimates, and a chat assistant that explains what those estimates mean in normal language.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenWorkbench}
            className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-4 py-2 text-sm font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)]"
          >
            Try a workbench
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-5 md:grid-cols-4 md:px-7">
        {featureCards.map(({ Icon, title, text }) => (
          <article key={title} className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
            <Icon className="h-5 w-5 text-[#65c6ff]" />
            <h3 className="mt-3 text-sm font-semibold text-[#edf3fb]">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-[#91a3bd]">{text}</p>
          </article>
        ))}
      </div>

      <div className="px-4 md:px-7">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-xl border border-[#263a55] bg-[#101b2c]/80 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
              <Sparkles className="h-4 w-4" />
              Basic workflow
            </div>
            <div className="mt-4 space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[32px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d3048] text-sm font-semibold text-[#9dc5ff]">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold text-[#edf3fb]">{step.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#92a4be]">{step.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#263a55] bg-[#101b2c]/80 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
              <HelpCircle className="h-4 w-4" />
              Good beginner questions
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                'Explain this result like I am a beginner.',
                'Which input matters most and why?',
                'Is the result safe, risky, or uncertain?',
                'What should I change first to improve the margin?',
                'What assumptions could make this estimate wrong?',
                'What test or simulation should I run next?',
              ].map((question) => (
                <p key={question} className="rounded-lg bg-[#172438]/82 px-3 py-2 text-xs leading-5 text-[#c8d5e7]">{question}</p>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-5 px-4 md:px-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
          <BookOpen className="h-4 w-4" />
          Copy these starter examples
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {examples.map((example) => (
            <article key={`${example.title}-${example.scenario}`} className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#789ee8]">{example.title}</p>
              <h3 className="mt-2 text-base font-semibold text-[#edf3fb]">{example.scenario}</h3>
              <p className="mt-2 text-xs leading-5 text-[#91a3bd]">{example.plain}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {example.values.map(([label, value]) => (
                  <div key={`${example.title}-${example.scenario}-${label}`} className="flex items-center justify-between gap-3 rounded-lg bg-[#172438]/82 px-3 py-2 text-xs">
                    <span className="text-[#879ab6]">{label}</span>
                    <span className="font-medium text-[#e0e9f6]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-[#2b405d] bg-[#142238]/92 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#789ee8]">Ask this</p>
                <p className="mt-2 text-xs leading-5 text-[#d1dced]">{example.question}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { BarChart3, BookOpen, Box, Download, Layers3, MessageSquareText, Sparkles, Thermometer, Waves, Wind } from 'lucide-react';

export const toolPages = [
  {
    id: 'start',
    label: 'Start Here',
    Icon: Sparkles,
    title: 'Phoenix Engine, Without the Physics Headache',
    summary: 'Phoenix is a screening tool: it helps you estimate, compare, and explain engineering ideas before you spend time on full CFD, FEA, lab testing, or process characterization.',
    steps: [
      ['Pick a domain', 'Choose Thermal, Aerodynamics, Battery Cooling, or Process Modeling based on what you are trying to understand.'],
      ['Use the Workbench', 'Enter real units and run deterministic calculations. The numbers come from equations, not from chat.'],
      ['Use Simulations', 'Open a visual 3D concept model when you need to understand layout, direction, or field behavior.'],
      ['Discuss in Chat', 'Ask Phoenix to explain the result, risks, assumptions, and next design step in plain English.'],
    ],
    concepts: [
      ['Screening', 'A fast first-pass calculation used to decide what is worth testing more carefully.'],
      ['Margin', 'How far you are from a limit. Positive margin is usually good; negative margin means the design fails that limit.'],
      ['Assumption', 'A simplification that makes the calculation possible. Every quick model has assumptions.'],
    ],
    example: {
      title: 'Beginner workflow',
      values: [['Goal', 'Keep a device below 90 C'], ['Tool', 'Thermal Workbench'], ['Next step', 'Discuss result in Chat']],
      prompt: 'Explain this result like I am new to engineering. What is safe, what is risky, and what should I test next?',
    },
  },
  {
    id: 'workbench',
    label: 'Workbench',
    Icon: BarChart3,
    title: 'How to Use Workbench',
    summary: 'Workbench is for quick deterministic calculations. It is best when you know the inputs and want a fast answer with saved runs and sensitivity sweeps.',
    steps: [
      ['Select a domain', 'Use the domain list to pick the calculator that matches the problem.'],
      ['Enter inputs', 'Use the units shown next to each field. Wrong units are the most common source of bad results.'],
      ['Run screening', 'Phoenix calculates outputs, status, assumptions, and a sensitivity sweep.'],
      ['Compare runs', 'Save multiple cases and compare how changes affect the result.'],
    ],
    concepts: [
      ['Deterministic model', 'The same inputs always produce the same outputs. This is different from AI guessing.'],
      ['Sensitivity sweep', 'A small what-if study showing how one input changes the result.'],
      ['Validation note', 'A warning that the inputs may be outside the comfortable range of the model.'],
    ],
    example: {
      title: 'Compare airflow changes',
      values: [['Case A', 'h = 25 W/m2K'], ['Case B', 'h = 50 W/m2K'], ['Watch', 'Temperature margin']],
      prompt: 'Which run has better margin, and why did changing airflow affect temperature?',
    },
  },
  {
    id: 'simulations',
    label: 'Simulations',
    Icon: Box,
    title: 'How to Use 3D Simulations',
    summary: 'Simulations show a visual concept model for each domain. The 3D view helps you understand layout and direction; the numeric outputs still come from reduced-order screening equations.',
    steps: [
      ['Choose a module', 'Pick Electronics, Battery, Aerodynamics, or Process Modeling.'],
      ['Pick shape/field presets', 'Use visual presets like wing, duct, wafer, or showerhead to make the model easier to inspect.'],
      ['Use Run/Pause', 'Run animates flow/heat overlays. Pause keeps a static preview and saves CPU/GPU.'],
      ['Save or report', 'Save important cases, export a report, or send the result to Chat.'],
    ],
    concepts: [
      ['3D visualization', 'A visual explanation of the model, not a full mesh-based solver.'],
      ['Reduced-order model', 'A simplified equation-based model that captures the main trend.'],
      ['Visual preset', 'A shape used for understanding. Presets do not secretly change physics unless an input says so.'],
    ],
    example: {
      title: 'Electronics enclosure preview',
      values: [['Module', 'Electronics Enclosure'], ['Overlay', 'Heat + Flow'], ['Action', 'Run, then Pause']],
      prompt: 'Explain what the 3D hotspot and airflow arrows mean. Which design change would most likely reduce the hotspot?',
    },
  },
  {
    id: 'chat',
    label: 'Chat',
    Icon: MessageSquareText,
    title: 'How to Use Chat',
    summary: 'Chat is for interpretation. It should explain calculations, assumptions, risks, design tradeoffs, and next steps. It should not replace the deterministic Workbench math.',
    steps: [
      ['Ask for explanation', 'Use beginner language if you want: "explain this like I am new to thermal design."'],
      ['Ask for priorities', 'Ask which input matters most and what to change first.'],
      ['Ask for validation', 'Ask what test, CFD, FEA, or measurement would confirm the screening result.'],
      ['Search history', 'Use conversation search when you need an older explanation.'],
    ],
    concepts: [
      ['Interpretation', 'Turning outputs into engineering meaning.'],
      ['Tradeoff', 'A change that improves one thing but may hurt another, like more coolant flow increasing pressure drop.'],
      ['Validation', 'Evidence needed before trusting the design in the real world.'],
    ],
    example: {
      title: 'Good chat prompt',
      values: [['Input', 'Saved run'], ['Question', 'What should I change first?'], ['Output', 'Reasoned next steps']],
      prompt: 'Explain the result in simple terms. Rank the top three risks and give me one low-cost design change to try next.',
    },
  },
  {
    id: 'reports',
    label: 'Reports',
    Icon: Download,
    title: 'Reports and Exports',
    summary: 'Use exports when you need to share a result with your team or keep a design-review trail.',
    steps: [
      ['Export conversation', 'Chat exports include the reasoning and discussion history.'],
      ['Export simulation report', 'Simulation reports include inputs, outputs, assumptions, sweeps, and a 3D snapshot.'],
      ['Share assumptions', 'Always include assumptions so others know what the model did and did not calculate.'],
    ],
    concepts: [
      ['Design review', 'A structured check of whether the result is credible enough for the next step.'],
      ['Traceability', 'Being able to see exactly which inputs produced the result.'],
    ],
    example: {
      title: 'Report checklist',
      values: [['Include', 'Inputs and outputs'], ['Include', 'Assumptions'], ['Include', 'Validation plan']],
      prompt: 'Turn this saved run into a short design-review summary with assumptions and validation steps.',
    },
  },
];

export const domainPages = [
  {
    id: 'thermal',
    label: 'Thermal Physics',
    Icon: Thermometer,
    title: 'Thermal Analysis',
    summary: 'Thermal analysis asks: how hot will something get, and how much margin do we have before a temperature limit?',
    concepts: [
      ['Heat load (W)', 'How much power becomes heat. More watts usually means higher temperature.'],
      ['Thermal resistance (K/W)', 'How hard it is for heat to escape. Lower thermal resistance is better.'],
      ['Convection h', 'How strongly air removes heat from a surface. Fans usually increase h.'],
      ['Temperature margin', 'Limit temperature minus predicted temperature. Positive is good.'],
    ],
    equation: 'Temperature = Ambient + Heat load x Total thermal resistance',
    beginnerGuide: {
      mentalModel: 'Think of heat like water trying to leave a tank. Heat load is how fast water enters the tank. Thermal resistance is how narrow the drain is. Ambient temperature is the starting water level outside the tank. If heat enters faster than it can escape, the component temperature rises.',
      whatHappens: [
        'A component turns electrical power into heat.',
        'That heat travels through material, interfaces, heat sinks, and finally into air or coolant.',
        'Every layer resists heat flow a little. Phoenix adds those resistances into one total thermal resistance.',
        'Temperature rise is heat load multiplied by total resistance.',
      ],
      inputGuide: [
        ['Heat load', 'Power that becomes heat. A 75 W device is dumping 75 joules of heat every second.'],
        ['Effective area', 'The useful area available to move heat out. Bigger area usually lowers temperature.'],
        ['Conductivity', 'How easily a material carries heat. Copper and aluminum are good; plastics are usually poor.'],
        ['Interface resistance', 'Resistance from contact layers like thermal paste, pads, screws, or imperfect contact.'],
        ['Convection h', 'How strongly air removes heat. Natural convection is low; forced fan airflow is higher.'],
      ],
      outputGuide: [
        ['Predicted temperature', 'The rough component or surface temperature from this simplified thermal path.'],
        ['Thermal resistance', 'How many degrees temperature rises per watt of heat. Lower is better.'],
        ['Margin', 'Limit minus prediction. Positive means it passes the limit in this model.'],
      ],
      mistakes: [
        'Using surface area that heat cannot actually reach.',
        'Forgetting interface resistance from pads, paste, or mounting pressure.',
        'Assuming a fan gives high airflow everywhere inside a cramped enclosure.',
        'Treating this as junction temperature when the input path is only board or heat-sink level.',
      ],
    },
    useWhen: ['Electronics cooling', 'Heat sinks', 'Enclosures', 'Power modules', 'Early thermal feasibility checks'],
    limitations: ['No detailed 3D spreading', 'No transient warm-up', 'No radiation unless approximated in h', 'No CFD airflow solution'],
    example: {
      title: 'Small electronics enclosure',
      values: [['Heat load', '75 W'], ['Area', '250 cm2'], ['Convection h', '45 W/m2K'], ['Ambient', '25 C'], ['Limit', '90 C']],
      prompt: 'My predicted temperature is close to the limit. Explain the result like I am new to thermal design and tell me the easiest change to improve margin.',
    },
  },
  {
    id: 'aero',
    label: 'Aero Physics',
    Icon: Wind,
    title: 'Aerodynamics',
    summary: 'Aerodynamics asks: how much force does moving air create on a body, and whether drag or lift is acceptable.',
    concepts: [
      ['Dynamic pressure', 'The pressure-like effect of moving air. It grows with velocity squared.'],
      ['Drag', 'Force pushing opposite the motion. More speed, area, or Cd increases drag.'],
      ['Lift', 'Force perpendicular to flow. It can be useful or risky depending on the design.'],
      ['Reynolds number', 'A flow similarity number. It helps judge whether test data/correlations apply.'],
    ],
    equation: 'Drag = 0.5 x density x velocity^2 x area x Cd',
    beginnerGuide: {
      mentalModel: 'Air feels soft when you move slowly, but at speed it behaves like something you must push through. Doubling speed does not double drag; it roughly quadruples drag because velocity is squared.',
      whatHappens: [
        'Air hits the object and creates pressure forces and friction forces.',
        'Those forces combine into drag, which resists motion.',
        'If the shape creates upward or downward force, that is lift.',
        'Phoenix does not discover Cd or Cl from the shape; it uses the coefficients you provide.',
      ],
      inputGuide: [
        ['Velocity', 'How fast the air moves relative to the object. This is usually the most powerful input.'],
        ['Density', 'How heavy the fluid is per volume. Dense fluid creates larger forces.'],
        ['Reference area', 'The area used with Cd and Cl. It must match how your coefficients were defined.'],
        ['Cd', 'Drag coefficient. A compact smooth shape may be low; a blunt shape is higher.'],
        ['Cl', 'Lift coefficient. Positive or negative depending on force direction and convention.'],
      ],
      outputGuide: [
        ['Dynamic pressure', 'A measure of how intense the moving air is. It rises with velocity squared.'],
        ['Drag', 'The force trying to slow the object or load its mount.'],
        ['Lift', 'The sideways/upward/downward force from the flow.'],
        ['Reynolds number', 'A similarity number that says whether flow behavior is comparable to your data source.'],
      ],
      mistakes: [
        'Using Cd from one reference area but entering a different area.',
        'Assuming the 3D visual shape automatically predicts Cd or Cl.',
        'Ignoring compressibility at high speed.',
        'Trusting the result without test, CFD, or reliable coefficient data.',
      ],
    },
    useWhen: ['Vehicle fairings', 'Winglets', 'Duct concepts', 'External-flow force checks'],
    limitations: ['Cd and Cl must come from data or assumptions', 'No stall prediction', 'No compressibility model', 'No CFD geometry solution'],
    example: {
      title: 'Small fairing',
      values: [['Velocity', '30 m/s'], ['Area', '0.45 m2'], ['Cd', '0.32'], ['Cl', '0.1'], ['Drag limit', '100 N']],
      prompt: 'Explain drag, lift, dynamic pressure, and Reynolds number from this run in simple words. What should I verify before trusting it?',
    },
  },
  {
    id: 'battery',
    label: 'Battery Cooling',
    Icon: Waves,
    title: 'Battery Cooling',
    summary: 'Battery cooling asks: how much the coolant warms up, how much pressure drop the loop creates, and whether thermal margin is acceptable.',
    concepts: [
      ['Coolant rise', 'How much hotter the coolant gets after absorbing heat.'],
      ['Flow rate', 'More flow usually lowers coolant temperature rise but increases pressure drop.'],
      ['Pressure drop', 'Resistance the pump must overcome. Higher pressure drop needs more pump power.'],
      ['Cell-to-coolant resistance', 'How hard it is for heat to move from cell/module into coolant.'],
    ],
    equation: 'Heat load = mass flow x specific heat x coolant temperature rise',
    beginnerGuide: {
      mentalModel: 'A cooling loop is like a conveyor belt carrying heat away. More coolant flow means the belt moves faster, so each bit of coolant carries less heat and gets less hot. But moving it faster also makes the pump work harder.',
      whatHappens: [
        'Heat from cells or electronics enters a cold plate.',
        'Coolant flows through channels and absorbs that heat.',
        'The coolant outlet temperature rises based on heat load, flow rate, density, and specific heat.',
        'Pressure drop estimates how hard it is to push coolant through the channels.',
      ],
      inputGuide: [
        ['Heat load', 'Total heat the coolant must remove. Higher heat means warmer outlet.'],
        ['Flow rate', 'How much coolant moves through the loop each minute. More flow lowers coolant rise.'],
        ['Specific heat', 'How much heat the coolant can carry per kilogram per degree. Water is strong here.'],
        ['Viscosity', 'How thick the coolant is. Higher viscosity usually increases pressure drop.'],
        ['Channel size/count', 'Small channels improve compactness but can increase pressure drop. More parallel channels reduce velocity per channel.'],
      ],
      outputGuide: [
        ['Coolant outlet', 'Bulk coolant temperature leaving the cold plate. It is not automatically cell temperature.'],
        ['Pressure drop', 'How much pressure the pump must overcome through the channels.'],
        ['Reynolds number', 'Indicates laminar, transitional, or turbulent flow tendency.'],
        ['Pump power', 'Hydraulic power estimate from pressure drop times flow. Real electrical pump power is higher.'],
      ],
      mistakes: [
        'Confusing coolant outlet temperature with maximum cell temperature.',
        'Ignoring manifolds, bends, fittings, and local losses.',
        'Using water properties for glycol or oil coolant.',
        'Increasing flow without checking pressure drop and pump capability.',
      ],
    },
    useWhen: ['Cold plates', 'Battery packs', 'Liquid loops', 'Fast-charge thermal checks'],
    limitations: ['Bulk coolant estimate only', 'No manifold imbalance', 'No transient drive cycle', 'No cell-level 3D conduction'],
    example: {
      title: 'Baseline cold plate',
      values: [['Heat load', '1200 W'], ['Flow', '6 L/min'], ['Inlet', '25 C'], ['Outlet limit', '35 C'], ['Channels', '10 parallel']],
      prompt: 'Is this cooling loop good enough? Explain outlet temperature, pressure drop, and what a pump would need to handle.',
    },
  },
  {
    id: 'process',
    label: 'Process Physics',
    Icon: Layers3,
    title: 'Process Modeling',
    summary: 'Process modeling asks: how temperature sensitivity affects deposition rate, thickness, and center-to-edge uniformity.',
    concepts: [
      ['Deposition rate', 'How fast material grows, usually in nm/min.'],
      ['Activation energy', 'How sensitive the reaction rate is to temperature. Higher value means more temperature sensitivity.'],
      ['Uniformity', 'How different the center and edge thickness are. Lower nonuniformity is better.'],
      ['Arrhenius behavior', 'A common model where reaction rate changes exponentially with temperature.'],
    ],
    equation: 'Edge rate is inferred from center rate using Arrhenius temperature sensitivity',
    beginnerGuide: {
      mentalModel: 'Imagine the wafer as a circular field where the center and edge may not be at the same temperature. If the chemistry is temperature-sensitive, a slightly cooler edge can grow material slower, causing a thinner edge film.',
      whatHappens: [
        'The center deposition rate is treated as the known calibration point.',
        'Phoenix uses the center and edge temperatures to infer the edge deposition rate.',
        'The process time converts rate into thickness.',
        'Nonuniformity compares center thickness and edge thickness.',
      ],
      inputGuide: [
        ['Center rate', 'Known growth rate at the wafer center. This anchors the model.'],
        ['Center and edge temperature', 'The temperature difference that drives rate difference.'],
        ['Activation energy', 'How strongly rate reacts to temperature. Higher value makes small temperature changes matter more.'],
        ['Process time', 'Longer time grows more film, but percentage nonuniformity comes from rate difference.'],
        ['Uniformity limit', 'The maximum allowed center-edge thickness mismatch.'],
      ],
      outputGuide: [
        ['Center thickness', 'Film thickness predicted at the center after the process time.'],
        ['Edge thickness', 'Film thickness predicted at the edge after temperature correction.'],
        ['Mean thickness', 'Average of center and edge thickness in this two-point model.'],
        ['Nonuniformity', 'Percent mismatch between center and edge. Lower is better.'],
      ],
      mistakes: [
        'Using this model when transport, plasma, or gas depletion dominates instead of surface reaction kinetics.',
        'Assuming two points describe the full radial wafer profile.',
        'Using activation energy without calibration data.',
        'Ignoring thickness target while only watching uniformity.',
      ],
    },
    useWhen: ['Wafer deposition', 'Recipe screening', 'Temperature sensitivity checks', 'Uniformity reasoning'],
    limitations: ['Only center and edge points', 'No plasma chemistry', 'No gas depletion', 'No full radial/chamber model'],
    example: {
      title: 'Mild edge cooling',
      values: [['Center rate', '10 nm/min'], ['Center temp', '400 C'], ['Edge temp', '395 C'], ['Activation energy', '45 kJ/mol'], ['Limit', '5%']],
      prompt: 'Explain why a 5 C edge temperature drop changes thickness. What should I tune first to improve uniformity?',
    },
  },
];

export const allPages = [...toolPages, ...domainPages];

export const extraExamplesByPage = {
  start: [
    {
      title: 'Compare two design ideas',
      values: [['Idea A', 'Lower airflow'], ['Idea B', 'Higher airflow'], ['Compare', 'Margin and tradeoffs']],
      prompt: 'Compare these two runs in beginner language. Which one is safer, and what tradeoff should I watch?',
    },
    {
      title: 'Find the next validation step',
      values: [['Result', 'Positive margin'], ['Concern', 'Assumptions'], ['Goal', 'Know what to test']],
      prompt: 'This screening result passes. What evidence do I need before I trust it for a real prototype?',
    },
  ],
  workbench: [
    {
      title: 'Find the limiting input',
      values: [['Change', 'One input at a time'], ['Watch', 'Margin'], ['Use', 'Sensitivity sweep']],
      prompt: 'Looking at these runs, which input has the strongest effect on the result and why?',
    },
    {
      title: 'Create a safe baseline',
      values: [['First run', 'Nominal values'], ['Second run', 'Worst case'], ['Decision', 'Use worst-case margin']],
      prompt: 'Help me turn this nominal run into a conservative worst-case run. Which inputs should I adjust?',
    },
  ],
  simulations: [
    {
      title: 'Battery cold plate preview',
      values: [['Module', 'Battery Cold Plate'], ['Overlay', 'Flow'], ['Watch', 'Outlet temp and pressure drop']],
      prompt: 'Explain the coolant arrows and pressure drop. What geometry change would reduce pump load?',
    },
    {
      title: 'Aerodynamics shape check',
      values: [['Module', 'Aerodynamics'], ['Preset', 'Wing vs bluff body'], ['Watch', 'Drag and lift vectors']],
      prompt: 'Explain what the force arrows mean and what coefficient data I need before trusting this result.',
    },
  ],
  chat: [
    {
      title: 'Ask for a design change',
      values: [['Result', 'Near limit'], ['Need', 'Improve margin'], ['Output', 'Ranked changes']],
      prompt: 'Give me three design changes ranked by easiest to hardest, and explain what each one improves.',
    },
    {
      title: 'Ask for assumptions',
      values: [['Concern', 'Model limits'], ['Need', 'Risk list'], ['Output', 'Validation plan']],
      prompt: 'List the assumptions in this run. Which assumptions are most likely to make the result wrong?',
    },
  ],
  reports: [
    {
      title: 'Share a screening result',
      values: [['Audience', 'Design review'], ['Include', 'Inputs and margin'], ['Include', 'Assumptions']],
      prompt: 'Write a concise design-review summary for this result with risks and next validation steps.',
    },
    {
      title: 'Prototype decision note',
      values: [['Decision', 'Build or revise'], ['Evidence', 'Screening run'], ['Need', 'Clear recommendation']],
      prompt: 'Based on this run, should I prototype this design or revise it first? Explain the reasoning clearly.',
    },
  ],
  thermal: [
    {
      title: 'Natural convection warning',
      values: [['Heat load', '30 W'], ['Convection h', '8 W/m2K'], ['Ambient', '28 C'], ['Limit', '85 C']],
      prompt: 'Explain why low convection makes this case risky and what cooling changes are most practical.',
    },
    {
      title: 'Interface resistance problem',
      values: [['Heat load', '120 W'], ['Interface R', '0.25 K/W'], ['Area', '180 cm2'], ['Limit', '100 C']],
      prompt: 'Explain how interface resistance affects temperature and whether improving TIM/contact helps more than airflow.',
    },
  ],
  aero: [
    {
      title: 'High-speed drag growth',
      values: [['Velocity', '55 m/s'], ['Area', '0.62 m2'], ['Cd', '0.38'], ['Drag limit', '350 N']],
      prompt: 'Why did drag increase so much at higher speed? Explain the velocity-squared effect simply.',
    },
    {
      title: 'Lift-focused surface',
      values: [['Velocity', '22 m/s'], ['Area', '0.28 m2'], ['Cd', '0.12'], ['Cl', '0.65']],
      prompt: 'Explain whether this is more lift-focused or drag-focused, and what wind-tunnel or CFD data I need next.',
    },
  ],
  battery: [
    {
      title: 'Low-flow case',
      values: [['Heat load', '1000 W'], ['Flow', '2.5 L/min'], ['Inlet', '30 C'], ['Channels', '8 parallel']],
      prompt: 'Explain if this low-flow case is risky. Should I increase flow, add channels, or reduce heat load first?',
    },
    {
      title: 'Fast-charge tradeoff',
      values: [['Heat load', '2200 W'], ['Flow', '10 L/min'], ['Coolant', 'Glycol mix'], ['Concern', 'Pressure drop']],
      prompt: 'Explain the tradeoff between cooler outlet temperature and higher pressure drop for this fast-charge case.',
    },
  ],
  process: [
    {
      title: 'Large temperature mismatch',
      values: [['Center temp', '420 C'], ['Edge temp', '405 C'], ['Activation energy', '55 kJ/mol'], ['Limit', '4%']],
      prompt: 'Explain how temperature sensitivity affects edge thickness and why uniformity gets worse.',
    },
    {
      title: 'Slower low-temperature recipe',
      values: [['Rate', '6 nm/min'], ['Center temp', '350 C'], ['Edge temp', '348 C'], ['Time', '18 min']],
      prompt: 'Explain whether this slower recipe is more forgiving for thickness target and uniformity.',
    },
  ],
};

export const beginnerQuestions = [
  'Explain this result like I am a beginner.',
  'Which input matters most and why?',
  'Is the result safe, risky, or uncertain?',
  'What should I change first to improve the margin?',
  'What assumptions could make this estimate wrong?',
  'What test or simulation should I run next?',
];

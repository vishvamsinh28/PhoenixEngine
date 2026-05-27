export const projects = [
    {
        id: 'thermal-inverter',
        name: 'Aquila Inverter',
        discipline: 'Thermal / Electronics',
        status: 'Baseline ready',
        metric: 'Hotspot 92 C',
        color: '#f97316',
    },
    {
        id: 'winglet-flow',
        name: 'Orion Winglet',
        discipline: 'Aerodynamics',
        status: 'Geometry imported',
        metric: 'Mach 0.24',
        color: '#38bdf8',
    },
    {
        id: 'battery-coldplate',
        name: 'Helios Cold Plate',
        discipline: 'Battery Cooling',
        status: 'Sweep running',
        metric: '18 variants',
        color: '#34d399',
    },
    {
        id: 'wafer-deposition',
        name: 'Atlas Deposition',
        discipline: 'Semiconductor Process',
        status: 'Data calibrated',
        metric: '3.1% variance',
        color: '#a78bfa',
    },
];

export const messagesByProject = {
    'thermal-inverter': [
        {
            id: 'thermal-1',
            sender: 'user',
            message: 'Estimate the peak junction temperature if the inverter dissipates 180 W with 2.2 m/s inlet air at 35 C ambient.',
        },
        {
            id: 'thermal-2',
            sender: 'assistant',
            message: '**Rapid thermal estimate**\n\nUsing the current baseline geometry and an effective junction-to-ambient resistance of 0.32 C/W, the predicted hotspot is approximately **92.6 C** at steady state.\n\n**Key drivers**\n- A 15% reduction in airflow could add roughly 5-7 C.\n- Improving TIM resistance by 0.04 C/W could reduce the hotspot by about 7 C.\n\nThis is a physics-informed estimate for screening. Confirm final margins with detailed CFD/FEA and material boundary conditions.',
        },
    ],
    'winglet-flow': [
        {
            id: 'flow-1',
            sender: 'user',
            message: 'How will a 4 degree winglet cant change pressure drag at the cruise operating point?',
        },
        {
            id: 'flow-2',
            sender: 'assistant',
            message: '**Aerodynamic screening result**\n\nAt Mach 0.24 and the imported cruise condition, a 4 degree cant is likely to reduce wingtip vortex strength while introducing a small wetted-area penalty. The surrogate estimate indicates a **1.8-2.6% net drag reduction** near the design lift coefficient.\n\nRun a mesh-refined CFD comparison before selecting the manufacturing geometry.',
        },
    ],
    'battery-coldplate': [
        {
            id: 'battery-1',
            sender: 'user',
            message: 'Compare serpentine channel widths for keeping the pack delta-T below 4 C.',
        },
        {
            id: 'battery-2',
            sender: 'assistant',
            message: '**Design-space preview**\n\nThe 3.0 mm channel case currently provides the strongest temperature uniformity without the pressure-drop increase expected below 2.4 mm. A focused sweep across flow rate and glycol concentration will identify the lowest pump-power design that holds the 4 C requirement.',
        },
    ],
    'wafer-deposition': [
        {
            id: 'wafer-1',
            sender: 'user',
            message: 'Which process variables are most likely driving edge non-uniformity in this wafer deposition run?',
        },
        {
            id: 'wafer-2',
            sender: 'assistant',
            message: '**Process model readout**\n\nThe strongest candidate drivers are edge-zone temperature gradient, precursor residence-time variation, and chuck rotation stability. Uploading the latest run telemetry would allow a calibrated sensitivity ranking and a more defensible recipe recommendation.',
        },
    ],
};

export const projectById = (projectId) => projects.find((project) => project.id === projectId);

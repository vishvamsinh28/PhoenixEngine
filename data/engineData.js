export const projects = [
    {
        id: 'thermal-inverter',
        name: 'Thermal Analysis',
        discipline: 'Electronics cooling',
        context: 'Heat transfer, airflow and thermal resistance',
        color: '#f97316',
    },
    {
        id: 'winglet-flow',
        name: 'Aerodynamics',
        discipline: 'External flow',
        context: 'Lift, drag and pressure behavior',
        color: '#38bdf8',
    },
    {
        id: 'battery-coldplate',
        name: 'Battery Cooling',
        discipline: 'Liquid thermal management',
        context: 'Temperature uniformity and pressure drop',
        color: '#34d399',
    },
    {
        id: 'wafer-deposition',
        name: 'Process Modeling',
        discipline: 'Semiconductor manufacturing',
        context: 'Uniformity and sensitivity analysis',
        color: '#a78bfa',
    },
];

export const emptyMessagesByProject = Object.fromEntries(projects.map((project) => [project.id, []]));

export const projectById = (projectId) => projects.find((project) => project.id === projectId);

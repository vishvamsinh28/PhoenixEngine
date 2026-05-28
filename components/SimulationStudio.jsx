'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Box, Camera, Download, Eye, Fan, Flame, Gauge, Layers3, MessageSquare, Pause, Plane, Play, RotateCcw, Save, Thermometer, Trash2, Waves, Wind } from 'lucide-react';
import { calculateSimulationStudioRun, SIMULATION_AERO_SHAPE_OPTIONS, SIMULATION_COOLANT_OPTIONS, SIMULATION_MATERIAL_OPTIONS, SIMULATION_PROCESS_SHAPE_OPTIONS } from '@/lib/simulationStudioAnalysis';

const MODULES = {
    electronics: {
        label: 'Electronics Enclosure',
        subtitle: 'PCB hotspot, heat sink, enclosure airflow',
        Icon: Box,
        defaults: {
            moduleType: 'electronics',
            boardLengthMm: '180',
            boardWidthMm: '120',
            enclosureHeightMm: '70',
            heatLoadW: '85',
            componentAreaCm2: '18',
            componentHeightMm: '12',
            airflowCFM: '26',
            ambientC: '30',
            maxTemperatureC: '95',
            boardConductivityWmK: '14',
            heatSinkAreaCm2: '85',
            materialKey: 'aluminumCore',
        },
        fields: [
            { name: 'boardLengthMm', label: 'Board length', unit: 'mm' },
            { name: 'boardWidthMm', label: 'Board width', unit: 'mm' },
            { name: 'enclosureHeightMm', label: 'Enclosure height', unit: 'mm' },
            { name: 'heatLoadW', label: 'Heat load', unit: 'W' },
            { name: 'componentAreaCm2', label: 'Hotspot footprint', unit: 'cm2' },
            { name: 'componentHeightMm', label: 'Component height', unit: 'mm' },
            { name: 'airflowCFM', label: 'Airflow', unit: 'CFM' },
            { name: 'ambientC', label: 'Ambient', unit: 'C' },
            { name: 'maxTemperatureC', label: 'Max temperature', unit: 'C' },
            { name: 'boardConductivityWmK', label: 'Board conductivity', unit: 'W/mK' },
            { name: 'heatSinkAreaCm2', label: 'Heat sink area', unit: 'cm2' },
        ],
    },
    battery: {
        label: 'Battery Cold Plate',
        subtitle: 'Pack layout, coolant loop, pressure drop',
        Icon: Waves,
        defaults: {
            moduleType: 'battery',
            packLengthMm: '620',
            packWidthMm: '360',
            moduleCount: '8',
            heatLoadW: '2400',
            flowRateLMin: '9',
            inletTemperatureC: '25',
            maxCellTemperatureC: '45',
            channelLengthM: '1.4',
            channelWidthMm: '8',
            channelHeightMm: '3',
            parallelChannels: '18',
            plateConductivityWmK: '205',
            cellToCoolantResistanceKW: '0.006',
            coolantKey: 'glycol30',
        },
        fields: [
            { name: 'packLengthMm', label: 'Pack length', unit: 'mm' },
            { name: 'packWidthMm', label: 'Pack width', unit: 'mm' },
            { name: 'moduleCount', label: 'Modules', unit: 'count' },
            { name: 'heatLoadW', label: 'Pack heat load', unit: 'W' },
            { name: 'flowRateLMin', label: 'Coolant flow', unit: 'L/min' },
            { name: 'inletTemperatureC', label: 'Inlet temp', unit: 'C' },
            { name: 'maxCellTemperatureC', label: 'Cell temp limit', unit: 'C' },
            { name: 'channelLengthM', label: 'Channel length', unit: 'm' },
            { name: 'channelWidthMm', label: 'Channel width', unit: 'mm' },
            { name: 'channelHeightMm', label: 'Channel height', unit: 'mm' },
            { name: 'parallelChannels', label: 'Parallel channels', unit: 'count' },
            { name: 'plateConductivityWmK', label: 'Plate conductivity', unit: 'W/mK' },
            { name: 'cellToCoolantResistanceKW', label: 'Cell-to-coolant R', unit: 'K/W' },
        ],
    },
    aerodynamics: {
        label: 'Aerodynamics',
        subtitle: 'External-flow force field and coefficient screening',
        Icon: Plane,
        defaults: {
            moduleType: 'aerodynamics',
            shapeKey: 'wing',
            velocityMS: '30',
            densityKgM3: '1.225',
            viscosityPaS: '0.0000181',
            referenceAreaM2: '0.45',
            characteristicLengthM: '0.8',
            dragCoefficient: '0.32',
            liftCoefficient: '0.1',
            dragLimitN: '100',
        },
        fields: [
            { name: 'velocityMS', label: 'Velocity', unit: 'm/s' },
            { name: 'densityKgM3', label: 'Density', unit: 'kg/m3' },
            { name: 'viscosityPaS', label: 'Viscosity', unit: 'Pa s' },
            { name: 'referenceAreaM2', label: 'Reference area', unit: 'm2' },
            { name: 'characteristicLengthM', label: 'Length scale', unit: 'm' },
            { name: 'dragCoefficient', label: 'Drag coefficient', unit: 'Cd' },
            { name: 'liftCoefficient', label: 'Lift coefficient', unit: 'Cl' },
            { name: 'dragLimitN', label: 'Drag limit', unit: 'N' },
        ],
    },
    process: {
        label: 'Process Modeling',
        subtitle: 'Wafer/chamber uniformity field visualization',
        Icon: Layers3,
        defaults: {
            moduleType: 'process',
            shapeKey: 'wafer',
            waferDiameterMm: '300',
            centerRateNmMin: '10',
            centerTemperatureC: '400',
            edgeTemperatureC: '395',
            activationEnergyKJMol: '45',
            processTimeMin: '10',
            targetThicknessNm: '100',
            maxNonuniformityPercent: '5',
        },
        fields: [
            { name: 'waferDiameterMm', label: 'Wafer diameter', unit: 'mm' },
            { name: 'centerRateNmMin', label: 'Center rate', unit: 'nm/min' },
            { name: 'centerTemperatureC', label: 'Center temp', unit: 'C' },
            { name: 'edgeTemperatureC', label: 'Edge temp', unit: 'C' },
            { name: 'activationEnergyKJMol', label: 'Activation energy', unit: 'kJ/mol' },
            { name: 'processTimeMin', label: 'Process time', unit: 'min' },
            { name: 'targetThicknessNm', label: 'Target thickness', unit: 'nm' },
            { name: 'maxNonuniformityPercent', label: 'Uniformity limit', unit: '%' },
        ],
    },
};

const VIEW_PRESETS = {
    iso: { label: 'Iso', azimuth: 0.72, elevation: 0.56, radius: 315 },
    top: { label: 'Top', azimuth: 0.001, elevation: 1.42, radius: 330 },
    front: { label: 'Front', azimuth: 0.001, elevation: 0.12, radius: 320 },
};

function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function buildDiscussionPrompt(run) {
    if (run.inputs.moduleType === 'battery') {
        return [
            'Interpret this Phoenix 3D battery cold-plate concept simulation and recommend practical design improvements.',
            `Geometry: ${run.inputs.moduleCount} modules in a ${run.inputs.packLengthMm} by ${run.inputs.packWidthMm} mm pack; channel ${run.inputs.channelWidthMm} by ${run.inputs.channelHeightMm} mm, ${run.inputs.channelLengthM} m length, ${run.inputs.parallelChannels} parallel paths.`,
            `Boundary conditions: heat load ${run.inputs.heatLoadW} W; flow ${run.inputs.flowRateLMin} L/min; inlet ${run.inputs.inletTemperatureC} C; max cell limit ${run.inputs.maxCellTemperatureC} C.`,
            `Calculated result: estimated cell max ${run.outputs.estimatedCellMaxC} C; coolant outlet ${run.outputs.coolantOutletC} C; pressure drop ${run.outputs.pressureDropKPa} kPa; Re ${run.outputs.reynoldsNumber}; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
            'Treat the 3D scene as a reduced-order visualization and concept screening model, not validated CFD or FEA.',
        ].join('\n');
    }
    if (run.inputs.moduleType === 'aerodynamics') {
        return [
            'Interpret this Phoenix 3D aerodynamics concept simulation and recommend what CFD or test validation should happen next.',
            `Geometry type: ${run.inputs.shapeKey}; velocity ${run.inputs.velocityMS} m/s; reference area ${run.inputs.referenceAreaM2} m2; characteristic length ${run.inputs.characteristicLengthM} m.`,
            `Inputs: density ${run.inputs.densityKgM3} kg/m3; viscosity ${run.inputs.viscosityPaS} Pa s; supplied Cd ${run.inputs.dragCoefficient}; supplied Cl ${run.inputs.liftCoefficient}; drag limit ${run.inputs.dragLimitN} N.`,
            `Calculated result: drag ${run.outputs.dragN} N; lift ${run.outputs.liftN} N; Re ${run.outputs.reynoldsNumber}; dynamic pressure ${run.outputs.dynamicPressurePa} Pa; margin ${run.outputs.dragMarginN} N; status ${run.outputs.status}.`,
            'Treat the 3D scene as a coefficient-based visualization and concept screening model, not CFD.',
        ].join('\n');
    }
    if (run.inputs.moduleType === 'process') {
        return [
            'Interpret this Phoenix 3D process modeling concept simulation and recommend process characterization steps.',
            `Geometry type: ${run.inputs.shapeKey}; wafer diameter ${run.inputs.waferDiameterMm} mm; center rate ${run.inputs.centerRateNmMin} nm/min; center temperature ${run.inputs.centerTemperatureC} C; edge temperature ${run.inputs.edgeTemperatureC} C.`,
            `Inputs: activation energy ${run.inputs.activationEnergyKJMol} kJ/mol; process time ${run.inputs.processTimeMin} min; target thickness ${run.inputs.targetThicknessNm} nm; uniformity limit ${run.inputs.maxNonuniformityPercent}%.`,
            `Calculated result: mean thickness ${run.outputs.meanThicknessNm} nm; nonuniformity ${run.outputs.nonuniformityPercent}%; uniformity margin ${run.outputs.uniformityMarginPercent}%; status ${run.outputs.status}.`,
            'Treat the 3D scene as a radial/process-field visualization, not a chamber CFD or plasma model.',
        ].join('\n');
    }

    return [
        'Interpret this Phoenix 3D electronics enclosure concept simulation and recommend practical design improvements.',
        `Geometry: ${run.inputs.boardLengthMm} by ${run.inputs.boardWidthMm} mm board in a ${run.inputs.enclosureHeightMm} mm tall enclosure; hotspot component area ${run.inputs.componentAreaCm2} cm2 and height ${run.inputs.componentHeightMm} mm.`,
        `Boundary conditions: heat load ${run.inputs.heatLoadW} W; airflow ${run.inputs.airflowCFM} CFM; ambient ${run.inputs.ambientC} C; temperature limit ${run.inputs.maxTemperatureC} C; heat sink area ${run.inputs.heatSinkAreaCm2} cm2.`,
        `Calculated result: hotspot ${run.outputs.predictedHotspotC} C; rise ${run.outputs.temperatureRiseC} C; thermal resistance ${run.outputs.totalResistanceKW} K/W; margin ${run.outputs.marginC} C; status ${run.outputs.status}.`,
        'Treat the 3D scene as a reduced-order visualization and concept screening model, not validated CFD or FEA.',
    ].join('\n');
}

function getValidationNotes(inputs, run) {
    const notes = [];
    if (!run)
        return notes;

    if (inputs.moduleType === 'battery') {
        if (run.outputs.pressureDropKPa > 25)
            notes.push('Pressure drop is high for a concept loop; check pump head, manifolds, and channel count.');
        if (run.outputs.reynoldsNumber < 2300)
            notes.push('The channel flow is likely laminar; verify heat-transfer coefficients before trusting cell margins.');
        if (run.outputs.marginC < 4)
            notes.push('Cooling margin is narrow; validate plate contact resistance and worst-case heat generation.');
        return notes;
    }
    if (inputs.moduleType === 'aerodynamics') {
        if (run.outputs.dragMarginN < 0)
            notes.push('Drag exceeds the concept limit; reduce Cd/reference area or revisit operating speed.');
        if (Number(inputs.velocityMS) > 70)
            notes.push('Velocity is high for this incompressible screening model; check Mach number before trusting margins.');
        if (Number(inputs.dragCoefficient) === 0)
            notes.push('Zero drag coefficient is only useful for a deliberate control case.');
        return notes;
    }
    if (inputs.moduleType === 'process') {
        if (run.outputs.uniformityMarginPercent < 1)
            notes.push('Uniformity margin is narrow; characterize center-edge temperature and rate calibration before relying on the result.');
        if (Math.abs(Number(inputs.centerTemperatureC) - Number(inputs.edgeTemperatureC)) > 20)
            notes.push('Large center-edge temperature deltas may exceed the useful range of this two-point model.');
        return notes;
    }

    if (run.outputs.heatFluxWcm2 > 8)
        notes.push('Heat flux is high for a compact enclosure; validate spreading resistance and junction-to-case resistance separately.');
    if (Number(inputs.airflowCFM) === 0)
        notes.push('Zero airflow uses natural-convection-style assumptions; orientation and venting will dominate real behavior.');
    if (Number(inputs.enclosureHeightMm) < 45)
        notes.push('Low enclosure height can create recirculation and fan bypass that this reduced-order model does not resolve.');
    return notes;
}

function reportRows(object) {
    return Object.entries(object).map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
}

function buildReportHtml(run, screenshot) {
    const sweepRows = run.sweep.map((point) => [
        point.label,
        Object.entries(point).filter(([key]) => key !== 'label').map(([key, value]) => `${key}: ${value}`).join(', '),
    ]);

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Phoenix 3D Simulation Report</title>
  <style>
    body { color: #172033; font-family: Inter, Arial, sans-serif; line-height: 1.45; margin: 32px; }
    h1 { font-size: 30px; letter-spacing: -0.03em; margin: 4px 0 8px; }
    h2 { color: #23304a; font-size: 16px; margin: 22px 0 10px; }
    .eyebrow { color: #2f63d7; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    .meta { color: #526179; font-size: 12px; }
    .status { background: #eef4ff; border: 1px solid #c9d9ff; border-radius: 10px; display: inline-block; font-weight: 700; margin-top: 12px; padding: 8px 12px; }
    .grid { display: grid; gap: 18px; grid-template-columns: 1fr 1fr; }
    img { border: 1px solid #d9e1ef; border-radius: 12px; max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #d9e1ef; font-size: 12px; padding: 8px; text-align: left; vertical-align: top; }
    th { color: #526179; width: 42%; }
    li { font-size: 12px; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="eyebrow">Phoenix Engine 3D Simulation Report</div>
  <h1>${escapeHtml(MODULES[run.inputs.moduleType]?.label || '3D Simulation Concept')}</h1>
  <div class="meta">Run ID: ${escapeHtml(run.id)} · Created: ${escapeHtml(formatDate(run.createdAt))}</div>
  <div class="status">${escapeHtml(run.outputs.status)}</div>
  ${screenshot ? `<h2>3D Snapshot</h2><img src="${screenshot}" alt="3D simulation snapshot" />` : ''}
  <section class="grid">
    <div><h2>Inputs</h2><table>${reportRows(run.inputs)}</table></div>
    <div><h2>Outputs</h2><table>${reportRows(run.outputs)}</table></div>
  </section>
  <h2>Sensitivity Sweep</h2>
  <table>${sweepRows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}</table>
  <h2>Assumptions</h2>
  <ul>${run.assumptions.map((assumption) => `<li>${escapeHtml(assumption)}</li>`).join('')}</ul>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 150));</script>
</body>
</html>`;
}

export default function SimulationStudio({ disabled, onDiscuss }) {
    const mountRef = useRef(null);
    const sceneRefs = useRef({});
    const [moduleType, setModuleType] = useState('electronics');
    const [inputs, setInputs] = useState(MODULES.electronics.defaults);
    const [runs, setRuns] = useState([]);
    const [selectedRunId, setSelectedRunId] = useState('');
    const [viewPreset, setViewPreset] = useState('iso');
    const [showAirflow, setShowAirflow] = useState(true);
    const [showEnclosure, setShowEnclosure] = useState(true);
    const [showHeat, setShowHeat] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [isLoadingRuns, setIsLoadingRuns] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [runError, setRunError] = useState('');

    const activeModule = MODULES[moduleType];
    const liveCalculation = useMemo(() => {
        try {
            return {
                run: {
                    id: `draft-${moduleType}`,
                    ...calculateSimulationStudioRun(inputs),
                    createdAt: new Date(),
                },
                error: '',
            };
        }
        catch (failure) {
            return { run: null, error: failure.message };
        }
    }, [inputs, moduleType]);
    const liveRun = liveCalculation.run;
    const selectedRun = useMemo(
        () => runs.find((run) => run.id === selectedRunId) || null,
        [runs, selectedRunId],
    );
    const displayRun = selectedRun || liveRun;
    const validationNotes = useMemo(() => getValidationNotes(inputs, liveRun), [inputs, liveRun]);
    const marginColor = displayRun?.outputs.marginC < 0
        ? 'text-[#f29bab]'
        : displayRun?.outputs.marginC < getMarginWarningThreshold(displayRun)
            ? 'text-[#f5bd73]'
            : 'text-[#6de1b0]';

    useEffect(() => {
        let mounted = true;
        setIsLoadingRuns(true);
        fetch('/api/simulation-runs')
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok)
                    throw new Error(payload.error || 'Unable to load saved simulations.');
                return payload.runs || [];
            })
            .then((savedRuns) => {
                if (mounted) {
                    setRuns(savedRuns);
                    setSelectedRunId(savedRuns[0]?.id || '');
                    setRunError('');
                }
            })
            .catch((failure) => {
                if (mounted)
                    setRunError(failure.message);
            })
            .finally(() => {
                if (mounted)
                    setIsLoadingRuns(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const updateVisibility = () => setIsTabVisible(!document.hidden);
        updateVisibility();
        document.addEventListener('visibilitychange', updateVisibility);
        return () => document.removeEventListener('visibilitychange', updateVisibility);
    }, []);

    useEffect(() => {
        let active = true;
        let frameId;
        let cleanup = () => {};

        async function mountScene() {
            if (!mountRef.current || !displayRun)
                return;

            const THREE = await import('three');
            if (!active || !mountRef.current)
                return;

            const mount = mountRef.current;
            mount.replaceChildren();
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0c1726);
            const camera = new THREE.PerspectiveCamera(44, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 1600);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.shadowMap.enabled = true;
            mount.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0x9fb9d6, 0.9);
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
            keyLight.position.set(180, 260, 140);
            keyLight.castShadow = true;
            scene.add(ambientLight, keyLight);

            const groups = {
                airflow: new THREE.Group(),
                enclosure: new THREE.Group(),
                heat: new THREE.Group(),
                moving: new THREE.Group(),
            };

            const hotspotRatio = Math.min(Math.max((displayRun.outputs.primaryValue - 25) / 80, 0), 1.35);
            const heatColor = new THREE.Color().setHSL(Math.max(0, 0.34 - hotspotRatio * 0.34), 0.88, 0.58);

            if (displayRun.inputs.moduleType === 'battery') {
                buildBatteryScene(THREE, scene, groups, displayRun, heatColor);
            }
            else if (displayRun.inputs.moduleType === 'aerodynamics') {
                buildAerodynamicsScene(THREE, scene, groups, displayRun, heatColor);
            }
            else if (displayRun.inputs.moduleType === 'process') {
                buildProcessScene(THREE, scene, groups, displayRun, heatColor);
            }
            else {
                buildElectronicsScene(THREE, scene, groups, displayRun, heatColor);
            }

            Object.values(groups).forEach((group) => scene.add(group));
            groups.airflow.visible = showAirflow;
            groups.enclosure.visible = showEnclosure;
            groups.heat.visible = showHeat;

            const preset = VIEW_PRESETS[viewPreset];
            let isDragging = false;
            let lastX = 0;
            let lastY = 0;
            let azimuth = preset.azimuth;
            let elevation = preset.elevation;
            let radius = preset.radius;
            const lookAt = new THREE.Vector3(0, displayRun.inputs.moduleType === 'process' ? 4 : displayRun.inputs.moduleType === 'battery' ? 12 : 28, 0);
            const updateCamera = () => {
                camera.position.set(
                    Math.sin(azimuth) * Math.cos(elevation) * radius,
                    Math.sin(elevation) * radius,
                    Math.cos(azimuth) * Math.cos(elevation) * radius,
                );
                camera.lookAt(lookAt);
            };
            updateCamera();

            const onPointerDown = (event) => {
                isDragging = true;
                lastX = event.clientX;
                lastY = event.clientY;
            };
            const onPointerMove = (event) => {
                if (!isDragging)
                    return;
                azimuth -= (event.clientX - lastX) * 0.008;
                elevation = Math.min(1.48, Math.max(0.08, elevation + (event.clientY - lastY) * 0.006));
                lastX = event.clientX;
                lastY = event.clientY;
                updateCamera();
            };
            const onPointerUp = () => {
                isDragging = false;
            };
            const onWheel = (event) => {
                event.preventDefault();
                radius = Math.min(680, Math.max(140, radius + event.deltaY * 0.35));
                updateCamera();
            };
            const onResize = () => {
                if (!mount.clientWidth || !mount.clientHeight)
                    return;
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };

            renderer.domElement.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('resize', onResize);

            const renderScene = () => {
                renderer.render(scene, camera);
            };
            const animate = () => {
                if (!isRunning || !isTabVisible) {
                    renderScene();
                    return;
                }
                frameId = window.requestAnimationFrame(animate);
                groups.moving.rotation.x += displayRun.inputs.moduleType === 'battery' ? 0 : 0.035 + (displayRun.inputs.airflowCFM || 0) * 0.0008;
                groups.airflow.position.x = ((Date.now() * 0.02) % 26) - 13;
                groups.heat.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.035);
                renderScene();
            };
            renderScene();
            if (isRunning && isTabVisible)
                animate();

            sceneRefs.current = { renderer, scene };
            cleanup = () => {
                window.cancelAnimationFrame(frameId);
                renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                renderer.domElement.removeEventListener('wheel', onWheel);
                window.removeEventListener('resize', onResize);
                scene.traverse((object) => {
                    object.geometry?.dispose?.();
                    if (Array.isArray(object.material))
                        object.material.forEach((material) => material.dispose?.());
                    else
                        object.material?.dispose?.();
                });
                renderer.dispose();
                if (mount.contains(renderer.domElement))
                    mount.removeChild(renderer.domElement);
            };
        }

        mountScene();
        return () => {
            active = false;
            cleanup();
        };
    }, [displayRun, isRunning, isTabVisible, showAirflow, showEnclosure, showHeat, viewPreset]);

    const switchModule = (nextModuleType) => {
        setModuleType(nextModuleType);
        setInputs(MODULES[nextModuleType].defaults);
        setSelectedRunId('');
    };

    const updateInput = (event) => {
        const { name, value } = event.target;
        setInputs((previous) => ({ ...previous, [name]: value }));
        setSelectedRunId('');
    };

    const saveRun = async () => {
        if (!liveRun || isSaving)
            return;
        setIsSaving(true);
        setRunError('');
        try {
            const response = await fetch('/api/simulation-runs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to save simulation run.');
            setRuns((previous) => [payload.run, ...previous.filter((run) => run.id !== payload.run.id)].slice(0, 12));
            setSelectedRunId(payload.run.id);
        }
        catch (failure) {
            setRunError(failure.message);
        }
        finally {
            setIsSaving(false);
        }
    };

    const deleteRun = async (runId) => {
        setRunError('');
        try {
            const response = await fetch('/api/simulation-runs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId }),
            });
            const payload = await response.json();
            if (!response.ok)
                throw new Error(payload.error || 'Unable to delete simulation run.');
            setRuns((previous) => previous.filter((run) => run.id !== runId));
            if (selectedRunId === runId)
                setSelectedRunId('');
        }
        catch (failure) {
            setRunError(failure.message);
        }
    };

    const resetInputs = () => {
        setInputs(activeModule.defaults);
        setSelectedRunId('');
        setViewPreset('iso');
        setShowAirflow(true);
        setShowEnclosure(true);
        setShowHeat(true);
    };

    const exportReport = () => {
        if (!displayRun)
            return;
        const screenshot = sceneRefs.current.renderer?.domElement?.toDataURL('image/png') || '';
        const reportWindow = window.open('', '_blank', 'width=980,height=760');
        if (!reportWindow)
            return;
        reportWindow.document.open();
        reportWindow.document.write(buildReportHtml(displayRun, screenshot));
        reportWindow.document.close();
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
            <div className="border-b border-[#263a55]/80 bg-[#162235]/60 px-4 py-3 md:rounded-t-[28px] md:px-6 md:py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,#24344b,#172538)] shadow-[0_5px_15px_rgba(0,0,0,0.15)] md:h-12 md:w-12">
                            <Layers3 className="h-5 w-5 text-[#65c6ff]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-[#e1e9f4] md:text-[16px]">3D Simulation Studio</h3>
                            <p className="hidden text-[13px] text-[#95a5be] sm:block">{activeModule.subtitle}</p>
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-5 gap-2 md:flex md:w-auto md:shrink-0 md:items-center md:gap-1.5">
                        <button type="button" onClick={resetInputs} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#365277] bg-[#1b2d45]/86 px-3 py-2 text-xs font-medium text-[#dce8f7] transition hover:bg-[#243a58]">
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                        <button type="button" onClick={() => setIsRunning((running) => !running)} disabled={!displayRun} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isRunning ? 'bg-[#352433] text-[#f3a8ba] hover:bg-[#402a3a]' : 'bg-[#183a31] text-[#8adfb5] hover:bg-[#21483c]'}`}>
                            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            <span className="hidden min-[390px]:inline">{isRunning ? 'Pause' : 'Run'}</span>
                        </button>
                        <button type="button" onClick={saveRun} disabled={!liveRun || isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#213550] px-3 py-2 text-xs font-medium text-[#aec8f3] transition hover:bg-[#28405f] disabled:cursor-not-allowed disabled:opacity-50">
                            <Save className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button type="button" onClick={exportReport} disabled={!displayRun} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b3040] px-3 py-2 text-xs font-medium text-[#9edbd0] transition hover:bg-[#244155] disabled:cursor-not-allowed disabled:opacity-50">
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Report</span>
                        </button>
                        <button type="button" onClick={() => displayRun && onDiscuss(buildDiscussionPrompt(displayRun))} disabled={disabled || !displayRun} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-3 py-2 text-xs font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)] disabled:cursor-not-allowed disabled:opacity-50">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Discuss</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 overflow-visible bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] lg:grid-cols-[320px_minmax(0,1fr)_330px] lg:overflow-hidden">
                <aside className="border-b border-[#263a55]/70 bg-[#101c2d]/68 p-4 lg:no-scrollbar lg:overflow-y-auto lg:border-b-0 lg:border-r">
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(MODULES).map(([id, module]) => {
                            const Icon = module.Icon;
                            return (
                                <button key={id} type="button" onClick={() => switchModule(id)} className={`rounded-xl border p-3 text-left transition ${moduleType === id ? 'border-[#5d8ff1] bg-[#1c3150]' : 'border-[#263a55] bg-[#0f1a2a]/72 hover:bg-[#142238]'}`}>
                                    <Icon className="h-4 w-4 text-[#65c6ff]" />
                                    <span className="mt-2 block text-xs font-semibold text-[#edf3fb]">{module.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">Setup</p>
                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">Build the concept</h2>
                    </div>

                    {moduleType === 'electronics' && (
                        <label className="mt-4 block text-xs text-[#9cacc4]">
                            Construction
                            <select name="materialKey" value={inputs.materialKey} onChange={updateInput} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                                {SIMULATION_MATERIAL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </label>
                    )}
                    {moduleType === 'battery' && (
                        <label className="mt-4 block text-xs text-[#9cacc4]">
                            Coolant
                            <select name="coolantKey" value={inputs.coolantKey} onChange={updateInput} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                                {SIMULATION_COOLANT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </label>
                    )}
                    {moduleType === 'aerodynamics' && (
                        <label className="mt-4 block text-xs text-[#9cacc4]">
                            Geometry
                            <select name="shapeKey" value={inputs.shapeKey} onChange={updateInput} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                                {SIMULATION_AERO_SHAPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </label>
                    )}
                    {moduleType === 'process' && (
                        <label className="mt-4 block text-xs text-[#9cacc4]">
                            Field model
                            <select name="shapeKey" value={inputs.shapeKey} onChange={updateInput} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                                {SIMULATION_PROCESS_SHAPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </label>
                    )}

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {activeModule.fields.map((field) => (
                            <label key={field.name} className="text-xs text-[#9cacc4]">
                                {field.label} <span className="text-[#687c9a]">({field.unit})</span>
                                <input required type="number" step="any" name={field.name} value={inputs[field.name]} onChange={updateInput} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0] focus:shadow-[0_0_0_3px_rgba(78,126,235,0.14)]"/>
                            </label>
                        ))}
                    </div>
                    {validationNotes.length > 0 && (
                        <div className="mt-4 rounded-xl border border-[#5a4620] bg-[#2b2416]/86 p-3">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5bd73]">
                                <AlertTriangle className="h-4 w-4"/>
                                Validation notes
                            </div>
                            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-[#d9c39a]">
                                {validationNotes.map((note) => <li key={note}>{note}</li>)}
                            </ul>
                        </div>
                    )}
                </aside>

                <section className="relative flex min-h-[430px] flex-col overflow-hidden bg-[#0c1726] sm:block sm:min-h-[500px]">
                    <div className="z-10 grid gap-2 border-b border-[#263a55]/70 bg-[#101c2d]/88 p-3 text-xs text-[#aab9d0] backdrop-blur sm:hidden">
                        <div className="flex gap-2 overflow-x-auto">
                            {Object.entries(VIEW_PRESETS).map(([id, preset]) => (
                                <button key={id} type="button" onClick={() => setViewPreset(id)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${viewPreset === id ? 'bg-[#28405f] text-[#edf3fb]' : 'bg-[#172438] hover:bg-[#1d3048]'}`}>
                                    <Camera className="h-3.5 w-3.5" />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <span className="shrink-0 rounded-lg border border-[#2b405d]/90 bg-[#0d1828] px-2.5 py-1.5">
                                {isRunning && isTabVisible ? 'Live' : isRunning ? 'Hidden pause' : 'Static'}
                            </span>
                            <button type="button" onClick={() => setShowAirflow((value) => !value)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 ${showAirflow ? 'bg-[#28405f] text-[#edf3fb]' : 'bg-[#172438] hover:bg-[#1d3048]'}`}><Wind className="h-3.5 w-3.5" />Flow</button>
                            <button type="button" onClick={() => setShowEnclosure((value) => !value)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 ${showEnclosure ? 'bg-[#28405f] text-[#edf3fb]' : 'bg-[#172438] hover:bg-[#1d3048]'}`}><Eye className="h-3.5 w-3.5" />Shell</button>
                            <button type="button" onClick={() => setShowHeat((value) => !value)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 ${showHeat ? 'bg-[#28405f] text-[#edf3fb]' : 'bg-[#172438] hover:bg-[#1d3048]'}`}><Flame className="h-3.5 w-3.5" />Heat</button>
                        </div>
                    </div>
                    <div ref={mountRef} className="h-[360px] min-h-[360px] w-full flex-1 cursor-grab active:cursor-grabbing sm:h-full sm:min-h-[500px]" />
                    <div className="absolute left-4 top-4 hidden flex-wrap gap-2 rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 p-2 text-xs text-[#aab9d0] backdrop-blur sm:flex">
                        {Object.entries(VIEW_PRESETS).map(([id, preset]) => (
                            <button key={id} type="button" onClick={() => setViewPreset(id)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition ${viewPreset === id ? 'bg-[#28405f] text-[#edf3fb]' : 'hover:bg-[#1d3048]'}`}>
                                <Camera className="h-3.5 w-3.5" />
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute left-4 top-20 hidden rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 px-3 py-2 text-xs text-[#aab9d0] backdrop-blur sm:block">
                        {isRunning && isTabVisible ? 'Running live animation' : isRunning ? 'Paused while tab is hidden' : 'Static preview'}
                    </div>
                    <div className="absolute right-4 top-4 hidden max-w-[calc(100%-2rem)] flex-wrap justify-end gap-2 rounded-xl border border-[#2b405d]/90 bg-[#101c2d]/78 p-2 text-xs text-[#aab9d0] backdrop-blur sm:flex">
                        <button type="button" onClick={() => setShowAirflow((value) => !value)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 ${showAirflow ? 'bg-[#28405f] text-[#edf3fb]' : 'hover:bg-[#1d3048]'}`}><Wind className="h-3.5 w-3.5" />Flow</button>
                        <button type="button" onClick={() => setShowEnclosure((value) => !value)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 ${showEnclosure ? 'bg-[#28405f] text-[#edf3fb]' : 'hover:bg-[#1d3048]'}`}><Eye className="h-3.5 w-3.5" />Shell</button>
                        <button type="button" onClick={() => setShowHeat((value) => !value)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 ${showHeat ? 'bg-[#28405f] text-[#edf3fb]' : 'hover:bg-[#1d3048]'}`}><Flame className="h-3.5 w-3.5" />Heat</button>
                    </div>
                    <div className="pointer-events-none absolute bottom-4 left-4 right-4 hidden gap-2 sm:grid sm:grid-cols-3">
                        {displayRun?.sweep.slice(1, 4).map((point) => (
                            <div key={point.label} className="rounded-xl border border-[#263a55]/80 bg-[#101c2d]/78 p-3 text-xs backdrop-blur">
                                <p className="text-[#7fa5ed]">{point.label}</p>
                                <p className="mt-1 font-semibold text-[#edf3fb]">{formatSweepCardValue(displayRun, point)}</p>
                                <p className={point.marginC < 0 ? 'text-[#f29bab]' : 'text-[#8adfb5]'}>{point.marginC} C margin</p>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="border-t border-[#263a55]/70 bg-[#101c2d]/68 p-4 lg:no-scrollbar lg:overflow-y-auto lg:border-l lg:border-t-0">
                    <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">Results</p>
                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">{getResultTitle(displayRun)}</h2>
                    </div>
                    {(liveCalculation.error || runError) && <p className="mb-4 rounded-lg bg-[#38202d]/90 px-3 py-2 text-sm text-[#f3a8ba]">{liveCalculation.error || runError}</p>}
                    {isLoadingRuns && <p className="mb-4 text-sm text-[#91a1bd]">Loading saved simulations...</p>}
                    {displayRun && (
                        <>
                            <MetricGrid run={displayRun} marginColor={marginColor} />
                            <p className={`mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 px-4 py-3 text-sm font-medium ${marginColor}`}>{displayRun.outputs.status}</p>
                            <SweepPanel run={displayRun} />
                            <details className="mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4 text-xs text-[#91a3bd]" open>
                                <summary className="cursor-pointer text-[#aab9d0]">Assumptions and limits</summary>
                                <ul className="mt-3 list-disc space-y-1.5 pl-4">
                                    {displayRun.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                                </ul>
                            </details>
                        </>
                    )}
                    <div className="mt-5">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">Saved simulation runs</h3>
                        <div className="space-y-2">
                            {runs.length === 0 && <p className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-3 text-xs text-[#8295b0]">Save a run to persist and compare simulation states.</p>}
                            {runs.map((run) => (
                                <div key={run.id} className={`flex items-center gap-2 rounded-xl ${run.id === selectedRunId ? 'bg-[#213550]' : 'bg-[#0f1a2a]/72 hover:bg-[#142238]'}`}>
                                    <button type="button" onClick={() => {
                                        setSelectedRunId(run.id);
                                        setModuleType(run.inputs.moduleType || 'electronics');
                                        setInputs({ ...MODULES[run.inputs.moduleType || 'electronics'].defaults, ...run.inputs });
                                    }} className="min-w-0 flex-1 px-3 py-2 text-left">
                                        <span className="block truncate text-xs text-[#d3ddec]">{MODULES[run.inputs.moduleType]?.label || 'Simulation'} / {formatSavedRunValue(run)}</span>
                                        <span className="block text-[11px] text-[#7387a5]">{formatDate(run.createdAt)}</span>
                                    </button>
                                    <button type="button" title="Delete run" onClick={() => deleteRun(run.id)} className="mr-2 rounded-md p-1.5 text-[#7f91ad] hover:bg-[#352433] hover:text-[#e39cab]"><Trash2 className="h-3.5 w-3.5"/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function getResultTitle(run) {
    if (!run)
        return 'Simulation state';
    if (run.inputs.moduleType === 'battery')
        return 'Cooling state';
    if (run.inputs.moduleType === 'aerodynamics')
        return 'Flow-force state';
    if (run.inputs.moduleType === 'process')
        return 'Uniformity state';
    return 'Thermal state';
}

function getMarginWarningThreshold(run) {
    if (!run)
        return 0;
    if (run.inputs.moduleType === 'battery')
        return 4;
    if (run.inputs.moduleType === 'aerodynamics')
        return run.inputs.dragLimitN * 0.1;
    if (run.inputs.moduleType === 'process')
        return 1;
    return 8;
}

function formatSweepCardValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.estimatedCellMaxC} C cell`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.dragN} N drag`;
    if (run.inputs.moduleType === 'process')
        return `${point.nonuniformityPercent}% nonuniformity`;
    return `${point.predictedHotspotC} C hotspot`;
}

function formatSavedRunValue(run) {
    if (run.inputs.moduleType === 'aerodynamics')
        return `${run.outputs.dragN} N drag / ${run.outputs.dragMarginN} N margin`;
    if (run.inputs.moduleType === 'process')
        return `${run.outputs.nonuniformityPercent}% / ${run.outputs.uniformityMarginPercent}% margin`;
    return `${run.outputs.primaryValue} C / ${run.outputs.marginC} C margin`;
}

function MetricGrid({ run, marginColor }) {
    let metrics;
    if (run.inputs.moduleType === 'battery') {
        metrics = [
            { label: 'Cell max', Icon: Thermometer, value: `${run.outputs.estimatedCellMaxC} C` },
            { label: 'Margin', Icon: Gauge, value: `${run.outputs.marginC} C`, className: marginColor },
            { label: 'Outlet', Icon: Waves, value: `${run.outputs.coolantOutletC} C` },
            { label: 'Pressure drop', Icon: Wind, value: `${run.outputs.pressureDropKPa} kPa` },
        ];
    }
    else if (run.inputs.moduleType === 'aerodynamics') {
        metrics = [
            { label: 'Drag', Icon: Wind, value: `${run.outputs.dragN} N` },
            { label: 'Lift', Icon: Plane, value: `${run.outputs.liftN} N` },
            { label: 'Reynolds', Icon: Gauge, value: run.outputs.reynoldsNumber.toLocaleString() },
            { label: 'Drag margin', Icon: Gauge, value: `${run.outputs.dragMarginN} N`, className: marginColor },
        ];
    }
    else if (run.inputs.moduleType === 'process') {
        metrics = [
            { label: 'Mean thickness', Icon: Layers3, value: `${run.outputs.meanThicknessNm} nm` },
            { label: 'Nonuniformity', Icon: Gauge, value: `${run.outputs.nonuniformityPercent}%` },
            { label: 'Uniformity margin', Icon: Gauge, value: `${run.outputs.uniformityMarginPercent}%`, className: marginColor },
            { label: 'Thickness error', Icon: Flame, value: `${run.outputs.thicknessErrorNm} nm` },
        ];
    }
    else {
        metrics = [
            { label: 'Hotspot', Icon: Thermometer, value: `${run.outputs.predictedHotspotC} C` },
            { label: 'Margin', Icon: Gauge, value: `${run.outputs.marginC} C`, className: marginColor },
            { label: 'Thermal R', Icon: Flame, value: `${run.outputs.totalResistanceKW} K/W` },
            { label: 'Air h', Icon: Wind, value: `${run.outputs.convectionCoefficientWm2K} W/m2K` },
        ];
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {metrics.map(({ label, Icon, value, className }) => (
                <div key={label} className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
                    <div className="flex items-center gap-2 text-xs text-[#8295b0]">
                        <Icon className="h-4 w-4 text-[#65c6ff]" />
                        {label}
                    </div>
                    <p className={`mt-2 text-xl font-semibold ${className || 'text-[#edf3fb]'}`}>{value}</p>
                </div>
            ))}
        </div>
    );
}

function SweepPanel({ run }) {
    const maxValue = Math.max(...run.sweep.map((point) => getSweepNumericValue(run, point)), 1);
    return (
        <div className="mt-4 rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
                <Fan className="h-4 w-4" />
                {getSweepTitle(run)}
            </div>
            <div className="mt-4 space-y-3">
                {run.sweep.map((point) => {
                    const value = getSweepNumericValue(run, point);
                    return (
                        <div key={point.label} className="grid grid-cols-[82px_minmax(0,1fr)_auto] items-center gap-3 text-xs text-[#b7c5d9]">
                            <span>{getSweepAxisLabel(run, point)}</span>
                            <span className="h-2 overflow-hidden rounded-full bg-[#223550]">
                                <span className="block h-full rounded-full bg-[linear-gradient(90deg,#f1695f,#f5bd73,#56c1ff)]" style={{ width: `${Math.max(8, (value / maxValue) * 100)}%` }} />
                            </span>
                            <span className="font-medium text-[#dee7f4]">{getSweepDisplayValue(run, point)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getSweepTitle(run) {
    if (run.inputs.moduleType === 'battery')
        return 'Coolant-flow sweep';
    if (run.inputs.moduleType === 'aerodynamics')
        return 'Velocity sweep';
    if (run.inputs.moduleType === 'process')
        return 'Edge-temperature sweep';
    return 'Airflow sweep';
}

function getSweepAxisLabel(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.flowRateLMin} L/min`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.velocityMS} m/s`;
    if (run.inputs.moduleType === 'process')
        return `${point.edgeTemperatureC} C`;
    return `${point.airflowCFM} CFM`;
}

function getSweepNumericValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return point.estimatedCellMaxC;
    if (run.inputs.moduleType === 'aerodynamics')
        return point.dragN;
    if (run.inputs.moduleType === 'process')
        return point.nonuniformityPercent;
    return point.predictedHotspotC;
}

function getSweepDisplayValue(run, point) {
    if (run.inputs.moduleType === 'battery')
        return `${point.estimatedCellMaxC} C`;
    if (run.inputs.moduleType === 'aerodynamics')
        return `${point.dragN} N`;
    if (run.inputs.moduleType === 'process')
        return `${point.nonuniformityPercent}%`;
    return `${point.predictedHotspotC} C`;
}

function buildElectronicsScene(THREE, scene, groups, run, heatColor) {
    const boardLength = run.inputs.boardLengthMm;
    const boardWidth = run.inputs.boardWidthMm;
    const enclosureHeight = run.inputs.enclosureHeightMm;
    const base = new THREE.Mesh(new THREE.BoxGeometry(boardLength, 3, boardWidth), new THREE.MeshStandardMaterial({ color: 0x1f8c72, metalness: 0.15, roughness: 0.58 }));
    base.receiveShadow = true;
    scene.add(base);

    const enclosure = new THREE.Mesh(new THREE.BoxGeometry(boardLength + 36, enclosureHeight, boardWidth + 36), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.16, metalness: 0.05, roughness: 0.3 }));
    enclosure.position.y = enclosureHeight / 2;
    groups.enclosure.add(enclosure);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(enclosure.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.58 }));
    edges.position.copy(enclosure.position);
    groups.enclosure.add(edges);

    const componentSide = Math.sqrt(run.inputs.componentAreaCm2) * 10;
    const component = new THREE.Mesh(new THREE.BoxGeometry(componentSide * 1.25, run.inputs.componentHeightMm, componentSide * 0.85), new THREE.MeshStandardMaterial({ color: heatColor, emissive: heatColor, emissiveIntensity: 0.35, roughness: 0.38 }));
    component.position.set(-boardLength * 0.14, run.inputs.componentHeightMm / 2 + 3, -boardWidth * 0.08);
    component.castShadow = true;
    scene.add(component);

    const sinkWidth = Math.max(36, Math.sqrt(Math.max(run.inputs.heatSinkAreaCm2, 1)) * 10);
    const sinkBase = new THREE.Mesh(new THREE.BoxGeometry(sinkWidth, 5, sinkWidth * 0.64), new THREE.MeshStandardMaterial({ color: 0x9aa8b7, metalness: 0.68, roughness: 0.24 }));
    sinkBase.position.set(component.position.x, component.position.y + run.inputs.componentHeightMm / 2 + 5, component.position.z);
    scene.add(sinkBase);
    for (let index = 0; index < 7; index += 1) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 22, sinkWidth * 0.58), new THREE.MeshStandardMaterial({ color: 0xc6d1dc, metalness: 0.7, roughness: 0.22 }));
        fin.position.set(component.position.x - sinkWidth * 0.38 + index * (sinkWidth * 0.76 / 6), sinkBase.position.y + 13, component.position.z);
        scene.add(fin);
    }

    const fanFrame = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 7, 48), new THREE.MeshStandardMaterial({ color: 0x213550, metalness: 0.25, roughness: 0.45 }));
    fanFrame.rotation.x = Math.PI / 2;
    fanFrame.position.set(-boardLength / 2 - 22, enclosureHeight / 2, 0);
    groups.moving.add(fanFrame);
    for (let index = 0; index < 4; index += 1) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 28), new THREE.MeshStandardMaterial({ color: 0x5ab8ff, emissive: 0x1c72aa, emissiveIntensity: 0.2 }));
        blade.position.copy(fanFrame.position);
        blade.rotation.y = index * Math.PI / 2;
        groups.moving.add(blade);
    }

    [-28, 0, 28].forEach((offset) => {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-boardLength / 2 - 8, enclosureHeight * 0.52, offset), boardLength * 0.82, 0x6bd6ff, 13, 7));
    });

    const glow = new THREE.Mesh(new THREE.SphereGeometry(componentSide * 0.64, 32, 16), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.16 }));
    glow.position.copy(component.position);
    groups.heat.add(glow);
    const grid = new THREE.GridHelper(Math.max(boardLength, boardWidth) + 90, 12, 0x315071, 0x22374f);
    grid.position.y = -4;
    scene.add(grid);
}

function buildBatteryScene(THREE, scene, groups, run, heatColor) {
    const packLength = run.inputs.packLengthMm / 2.8;
    const packWidth = run.inputs.packWidthMm / 2.8;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(packLength, 8, packWidth), new THREE.MeshStandardMaterial({ color: 0x8fa7b8, metalness: 0.62, roughness: 0.25 }));
    plate.position.y = 0;
    scene.add(plate);

    const modules = run.inputs.moduleCount;
    const columns = Math.ceil(Math.sqrt(modules));
    const rows = Math.ceil(modules / columns);
    const moduleWidth = packLength / columns * 0.72;
    const moduleDepth = packWidth / rows * 0.72;
    for (let index = 0; index < modules; index += 1) {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const batteryModule = new THREE.Mesh(new THREE.BoxGeometry(moduleWidth, 34, moduleDepth), new THREE.MeshStandardMaterial({ color: heatColor, emissive: heatColor, emissiveIntensity: 0.15, roughness: 0.42 }));
        batteryModule.position.set((col - (columns - 1) / 2) * (packLength / columns), 22, (row - (rows - 1) / 2) * (packWidth / rows));
        scene.add(batteryModule);
    }

    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x54c5ff, emissive: 0x0f5a82, emissiveIntensity: 0.18, metalness: 0.15, roughness: 0.3 });
    [-0.32, 0, 0.32].forEach((offset, index) => {
        const channel = new THREE.Mesh(new THREE.BoxGeometry(packLength * 0.88, 5, 5), tubeMaterial);
        channel.position.set(0, 8, offset * packWidth);
        groups.airflow.add(channel);
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(index % 2 ? -1 : 1, 0, 0), new THREE.Vector3(index % 2 ? packLength * 0.42 : -packLength * 0.42, 16, offset * packWidth), packLength * 0.72, 0x6bd6ff, 12, 7));
    });

    const enclosure = new THREE.Mesh(new THREE.BoxGeometry(packLength + 42, 70, packWidth + 42), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.12, roughness: 0.3 }));
    enclosure.position.y = 24;
    groups.enclosure.add(enclosure);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(enclosure.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.52 }));
    edges.position.copy(enclosure.position);
    groups.enclosure.add(edges);

    const glow = new THREE.Mesh(new THREE.BoxGeometry(packLength * 0.86, 45, packWidth * 0.82), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.12 }));
    glow.position.y = 22;
    groups.heat.add(glow);
    const grid = new THREE.GridHelper(Math.max(packLength, packWidth) + 120, 12, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

function buildAerodynamicsScene(THREE, scene, groups, run, heatColor) {
    const length = Math.max(90, run.inputs.characteristicLengthM * 145);
    const areaScale = Math.sqrt(run.inputs.referenceAreaM2) * 70;
    const shapeKey = run.inputs.shapeKey;
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x6fa8dc, metalness: 0.22, roughness: 0.36 });

    if (shapeKey === 'bluffBody') {
        const body = new THREE.Mesh(new THREE.BoxGeometry(areaScale, areaScale * 0.72, length * 0.55), bodyMaterial);
        body.position.y = 18;
        body.castShadow = true;
        scene.add(body);
        const wake = new THREE.Mesh(new THREE.ConeGeometry(areaScale * 0.42, length * 0.95, 40), new THREE.MeshBasicMaterial({ color: 0x56c1ff, transparent: true, opacity: 0.13 }));
        wake.rotation.z = Math.PI / 2;
        wake.position.set(length * 0.58, 18, 0);
        groups.airflow.add(wake);
    }
    else if (shapeKey === 'duct') {
        const duct = new THREE.Mesh(new THREE.CylinderGeometry(areaScale * 0.45, areaScale * 0.34, length, 48, 1, true), bodyMaterial);
        duct.rotation.z = Math.PI / 2;
        duct.position.y = 18;
        scene.add(duct);
        const lip = new THREE.Mesh(new THREE.TorusGeometry(areaScale * 0.45, 3.5, 10, 48), new THREE.MeshStandardMaterial({ color: 0x9fb9d6, metalness: 0.45, roughness: 0.25 }));
        lip.rotation.y = Math.PI / 2;
        lip.position.set(-length / 2, 18, 0);
        scene.add(lip);
    }
    else {
        const wingShape = new THREE.Shape();
        wingShape.moveTo(-length * 0.5, 0);
        wingShape.quadraticCurveTo(-length * 0.05, areaScale * 0.24, length * 0.5, 0);
        wingShape.quadraticCurveTo(-length * 0.05, -areaScale * 0.1, -length * 0.5, 0);
        const wing = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, { depth: areaScale * 0.72, bevelEnabled: false }), bodyMaterial);
        wing.rotation.x = Math.PI / 2;
        wing.position.set(0, 18, -areaScale * 0.36);
        wing.castShadow = true;
        scene.add(wing);
    }

    const dragArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-length * 0.85, 70, -areaScale * 0.55), length * 0.65, 0xf5bd73, 16, 8);
    const liftArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 35, areaScale * 0.55), Math.max(35, Math.abs(run.outputs.liftN) / Math.max(run.outputs.dragN, 1) * 45), 0x6de1b0, 14, 7);
    groups.heat.add(dragArrow, liftArrow);

    [-42, -14, 14, 42].forEach((zOffset) => {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-length * 0.92, 18, zOffset), length * 1.72, 0x6bd6ff, 12, 6));
    });

    const tunnel = new THREE.Mesh(new THREE.BoxGeometry(length * 1.9, 90, areaScale * 1.7), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.09, roughness: 0.3 }));
    tunnel.position.y = 22;
    groups.enclosure.add(tunnel);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tunnel.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.44 }));
    edges.position.copy(tunnel.position);
    groups.enclosure.add(edges);

    const grid = new THREE.GridHelper(length * 2.1, 14, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

function buildProcessScene(THREE, scene, groups, run, heatColor) {
    const radius = run.inputs.waferDiameterMm / 2;
    const waferRadius = Math.max(58, radius * 0.55);
    const wafer = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius, waferRadius, 4, 96), new THREE.MeshStandardMaterial({ color: 0x7f95a8, metalness: 0.35, roughness: 0.28 }));
    wafer.position.y = 0;
    scene.add(wafer);

    const rings = [0.28, 0.52, 0.76, 0.96];
    rings.forEach((factor, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(waferRadius * factor, 1.8, 8, 96), new THREE.MeshBasicMaterial({ color: index > 1 ? heatColor : 0x56c1ff, transparent: true, opacity: 0.45 }));
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 4 + index * 0.8;
        groups.heat.add(ring);
    });

    if (run.inputs.shapeKey === 'showerhead') {
        const showerhead = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 0.95, waferRadius * 0.95, 8, 80), new THREE.MeshStandardMaterial({ color: 0xaab7c4, metalness: 0.55, roughness: 0.24 }));
        showerhead.position.y = 58;
        scene.add(showerhead);
        for (let index = 0; index < 18; index += 1) {
            const angle = (index / 18) * Math.PI * 2;
            groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(Math.cos(angle) * waferRadius * 0.55, 50, Math.sin(angle) * waferRadius * 0.55), 34, 0x6bd6ff, 8, 4));
        }
    }
    else if (run.inputs.shapeKey === 'plasma') {
        const plasma = new THREE.Mesh(new THREE.SphereGeometry(waferRadius * 0.78, 48, 18), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.16 }));
        plasma.scale.y = 0.34;
        plasma.position.y = 32;
        groups.heat.add(plasma);
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 70, 0), 58, 0xa78bfa, 12, 7));
    }
    else {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 70, 0), 48, 0x6bd6ff, 12, 7));
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-waferRadius, 8, 0), waferRadius * 2, 0x6bd6ff, 10, 5));
    }

    const chamber = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 1.22, waferRadius * 1.22, 95, 80, 1, true), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.12, roughness: 0.3 }));
    chamber.position.y = 34;
    groups.enclosure.add(chamber);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 1.22, waferRadius * 1.22, 3, 80), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.18, roughness: 0.3 }));
    top.position.y = 82;
    groups.enclosure.add(top);

    const grid = new THREE.GridHelper(waferRadius * 3, 12, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

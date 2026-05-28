'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateSimulationStudioRun } from '@/lib/simulationStudioAnalysis';

import { SIMULATION_MODULES } from '@/data/simulationStudioConfig';

import { buildDiscussionPrompt, buildReportHtml, getMarginWarningThreshold, getRunMargin, getValidationNotes } from '@/lib/simulationStudioPresentation';
import { useSimulationStudioScene } from '@/hooks/useSimulationStudioScene';
import SimulationResultsPanel from '@/components/simulation-studio/SimulationResultsPanel';
import SimulationStudioHeader from '@/components/simulation-studio/SimulationStudioHeader';
import SimulationSetupPanel from '@/components/simulation-studio/SimulationSetupPanel';
import SimulationViewport from '@/components/simulation-studio/SimulationViewport';

export default function SimulationStudio({ disabled, onDiscuss }) {
    const mountRef = useRef(null);
    const sceneRefs = useRef({});
    const [moduleType, setModuleType] = useState('electronics');
    const [inputs, setInputs] = useState(SIMULATION_MODULES.electronics.defaults);
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

    const activeModule = SIMULATION_MODULES[moduleType];
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
    const displayMargin = getRunMargin(displayRun);
    const marginColor = displayMargin.value < 0
        ? 'text-[#f29bab]'
        : displayMargin.value < getMarginWarningThreshold(displayRun)
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

    useSimulationStudioScene({
        displayRun,
        isRunning,
        isTabVisible,
        mountRef,
        sceneRefs,
        showAirflow,
        showEnclosure,
        showHeat,
        viewPreset,
    });

    const switchModule = (nextModuleType) => {
        setModuleType(nextModuleType);
        setInputs(SIMULATION_MODULES[nextModuleType].defaults);
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

    const selectSavedRun = (run) => {
        setSelectedRunId(run.id);
        setModuleType(run.inputs.moduleType || 'electronics');
        setInputs({ ...SIMULATION_MODULES[run.inputs.moduleType || 'electronics'].defaults, ...run.inputs });
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
            <SimulationStudioHeader
                activeModule={activeModule}
                displayRun={displayRun}
                disabled={disabled}
                isRunning={isRunning}
                isSaving={isSaving}
                liveRun={liveRun}
                onDiscussRun={() => displayRun && onDiscuss(buildDiscussionPrompt(displayRun))}
                onExportReport={exportReport}
                onResetInputs={resetInputs}
                onToggleRunning={() => setIsRunning((running) => !running)}
                onSaveRun={saveRun}
            />

            <div className="grid min-h-0 flex-1 overflow-visible bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] lg:grid-cols-[320px_minmax(0,1fr)_330px] lg:overflow-hidden">
                <SimulationSetupPanel
                    activeModule={activeModule}
                    inputs={inputs}
                    moduleType={moduleType}
                    validationNotes={validationNotes}
                    onInputChange={updateInput}
                    onSwitchModule={switchModule}
                />

                <SimulationViewport
                    displayRun={displayRun}
                    isRunning={isRunning}
                    isTabVisible={isTabVisible}
                    mountRef={mountRef}
                    showAirflow={showAirflow}
                    showEnclosure={showEnclosure}
                    showHeat={showHeat}
                    viewPreset={viewPreset}
                    onToggleAirflow={() => setShowAirflow((value) => !value)}
                    onToggleEnclosure={() => setShowEnclosure((value) => !value)}
                    onToggleHeat={() => setShowHeat((value) => !value)}
                    onViewPresetChange={setViewPreset}
                />

                <SimulationResultsPanel
                    displayRun={displayRun}
                    liveError={liveCalculation.error}
                    runError={runError}
                    isLoadingRuns={isLoadingRuns}
                    marginColor={marginColor}
                    runs={runs}
                    selectedRunId={selectedRunId}
                    onSelectRun={selectSavedRun}
                    onDeleteRun={deleteRun}
                />
            </div>
        </div>
    );
}

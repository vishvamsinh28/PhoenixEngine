'use client';

import { AlertTriangle } from 'lucide-react';
import { SIMULATION_MODULES, SIMULATION_SELECT_OPTIONS } from '@/data/simulationStudioConfig';

export default function SimulationSetupPanel({
    activeModule,
    inputs,
    moduleType,
    validationNotes,
    onInputChange,
    onSwitchModule,
}) {
    return (
        <aside className="border-b border-[#263a55]/70 bg-[#101c2d]/68 p-4 lg:no-scrollbar lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(SIMULATION_MODULES).map(([id, module]) => {
                    const Icon = module.Icon;
                    return (
                        <button key={id} type="button" onClick={() => onSwitchModule(id)} className={`rounded-xl border p-3 text-left transition ${moduleType === id ? 'border-[#5d8ff1] bg-[#1c3150]' : 'border-[#263a55] bg-[#0f1a2a]/72 hover:bg-[#142238]'}`}>
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
                    <select name="materialKey" value={inputs.materialKey} onChange={onInputChange} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                        {SIMULATION_SELECT_OPTIONS.electronics.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>
            )}
            {moduleType === 'battery' && (
                <label className="mt-4 block text-xs text-[#9cacc4]">
                    Coolant
                    <select name="coolantKey" value={inputs.coolantKey} onChange={onInputChange} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                        {SIMULATION_SELECT_OPTIONS.battery.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>
            )}
            {moduleType === 'aerodynamics' && (
                <label className="mt-4 block text-xs text-[#9cacc4]">
                    Geometry
                    <select name="shapeKey" value={inputs.shapeKey} onChange={onInputChange} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                        {SIMULATION_SELECT_OPTIONS.aerodynamics.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>
            )}
            {moduleType === 'process' && (
                <label className="mt-4 block text-xs text-[#9cacc4]">
                    Field model
                    <select name="shapeKey" value={inputs.shapeKey} onChange={onInputChange} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0]">
                        {SIMULATION_SELECT_OPTIONS.process.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>
            )}

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {activeModule.fields.map((field) => (
                    <label key={field.name} className="text-xs text-[#9cacc4]">
                        {field.label} <span className="text-[#687c9a]">({field.unit})</span>
                        <input required type="number" step="any" name={field.name} value={inputs[field.name]} onChange={onInputChange} className="mt-1.5 block w-full rounded-lg border border-[#30435d]/80 bg-[#19263a]/90 px-3 py-2 text-sm text-[#dce5f3] outline-none transition focus:border-[#5276b0] focus:shadow-[0_0_0_3px_rgba(78,126,235,0.14)]"/>
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
    );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  MapPin, 
  Briefcase, 
  AlertTriangle, 
  Check, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Packet } from '@/lib/data';
import { ClimateType, ProfessionType, RiskLevel, CustomBundle } from '@/lib/bundleTypes';
import { generateCustomBundle } from '@/lib/bundlePlanGenerator';

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  packets: Packet[];
  onSaveBundle: (bundle: CustomBundle) => void;
}

export function BundleBuilderModal({
  isOpen,
  onClose,
  packets,
  onSaveBundle
}: BundleBuilderModalProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [climate, setClimate] = useState<ClimateType>('temperate');
  const [profession, setProfession] = useState<ProfessionType>('urban_resident');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');
  const [selectedPacketIds, setSelectedPacketIds] = useState<string[]>(['first-aid', 'water-sanitation']);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const togglePacket = (packetId: string) => {
    setSelectedPacketIds(prev => 
      prev.includes(packetId) ? prev.filter(id => id !== packetId) : [...prev, packetId]
    );
  };

  const toggleBranch = (branchId: string) => {
    setSelectedBranchIds(prev => 
      prev.includes(branchId) ? prev.filter(id => id !== branchId) : [...prev, branchId]
    );
  };

  const handleCreate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const bundle = generateCustomBundle({
        name: name.trim() || 'Custom Operator Bundle',
        description: description.trim(),
        climate,
        profession,
        riskLevel,
        selectedPacketIds,
        selectedBranchIds,
        packets
      });
      onSaveBundle(bundle);
      setIsGenerating(false);
      onClose();
      // Reset form
      setStep(1);
      setName('');
      setDescription('');
    }, 350);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-stone-900 dark:text-stone-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 dark:border-stone-800 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Custom Bundle Studio
                </h2>
                <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span>Step {step} of 3</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {step === 1 ? 'Operational Profile' : step === 2 ? 'Knowledge Areas' : 'Synthesis & Review'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="w-full bg-stone-100 dark:bg-stone-800/80 h-1">
            <div 
              className="bg-stone-900 dark:bg-stone-100 h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                    01. Bundle Identity & Mission
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Define the primary operational objective for this skill bundle.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      Bundle Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Urban Infrastructure Outage Kit, Cascade Alpine Prep..."
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                      Operational Context (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Describe target deployment environment or specific local constraints..."
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 resize-none"
                    />
                  </div>
                </div>

                {/* Location Climate */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={16} className="text-stone-600 dark:text-stone-400" />
                    <label className="text-xs font-mono font-medium uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Location Climate Stressors
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'temperate', label: 'Temperate', desc: 'Seasonal rain & mild shifts' },
                      { id: 'arid', label: 'Arid / Desert', desc: 'Extreme heat & dehydration' },
                      { id: 'tropical', label: 'Tropical / Humid', desc: 'Pathogens & monsoon flood' },
                      { id: 'subarctic', label: 'Cold / Subarctic', desc: 'Hypothermia & freeze injury' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setClimate(item.id as ClimateType)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[72px] flex flex-col justify-between ${
                          climate === item.id
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="font-semibold text-xs leading-tight">{item.label}</span>
                        <span className={`text-[10px] leading-tight mt-1 opacity-80 ${climate === item.id ? 'text-stone-200 dark:text-stone-700' : 'text-stone-500 dark:text-stone-400'}`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profession / Role */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase size={16} className="text-stone-600 dark:text-stone-400" />
                    <label className="text-xs font-mono font-medium uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Operator Profession / Role
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'urban_resident', label: 'Urban Resident', desc: 'Blackout egress, apartments' },
                      { id: 'trades', label: 'Trades / Mechanical', desc: 'Utility bypass & rigging' },
                      { id: 'healthcare', label: 'Healthcare / Medical', desc: 'Field triage & infection control' },
                      { id: 'logistics', label: 'Logistics / Field Ops', desc: 'Handrails & route clearance' },
                      { id: 'security_field', label: 'Field / Security', desc: 'Threat audits & rapid triage' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setProfession(item.id as ProfessionType)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px] flex flex-col justify-between ${
                          profession === item.id
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="font-semibold text-xs leading-tight">{item.label}</span>
                        <span className={`text-[10px] leading-tight mt-1 opacity-80 ${profession === item.id ? 'text-stone-200 dark:text-stone-700' : 'text-stone-500 dark:text-stone-400'}`}>
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anticipated Risk Level */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle size={16} className="text-stone-600 dark:text-stone-400" />
                    <label className="text-xs font-mono font-medium uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Anticipated Emergency Threat Level
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'low', label: 'Precautionary', sub: 'Weekly routine' },
                      { id: 'moderate', label: 'Disruption', sub: 'Bi-weekly verification' },
                      { id: 'high', label: 'Systemic Collapse', sub: 'Daily high-stress drills' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRiskLevel(item.id as RiskLevel)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer min-h-[58px] flex flex-col justify-center items-center ${
                          riskLevel === item.id
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="font-semibold text-xs">{item.label}</span>
                        <span className={`text-[10px] mt-0.5 opacity-80 ${riskLevel === item.id ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
                          {item.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                    02. Select Knowledge Areas & Modules
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Pick core survival packets and optional specialized branches for your bundle.
                  </p>
                </div>

                <div className="space-y-3">
                  {packets.map(packet => {
                    const isSelected = selectedPacketIds.includes(packet.id);
                    const PacketIcon = packet.icon || BookOpen;

                    return (
                      <div
                        key={packet.id}
                        className={`rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-stone-900 dark:border-stone-200 bg-stone-50/70 dark:bg-stone-800/50'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div
                          onClick={() => togglePacket(packet.id)}
                          className="p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}>
                              <PacketIcon size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                {packet.title}
                              </h4>
                              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                                {packet.description}
                              </p>
                            </div>
                          </div>

                          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900' 
                              : 'border-stone-300 dark:border-stone-600'
                          }`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>

                        {/* Sub-branches if available */}
                        {isSelected && packet.branches && packet.branches.length > 0 && (
                          <div className="px-4 pb-4 pt-1 border-t border-stone-200/60 dark:border-stone-800/60 mt-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                              Select Specialized Categories:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {packet.branches.map(branch => {
                                const isBranchSelected = selectedBranchIds.includes(branch.id);
                                return (
                                  <button
                                    key={branch.id}
                                    type="button"
                                    onClick={() => toggleBranch(branch.id)}
                                    className={`px-3 py-2 rounded-xl text-left text-xs border flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                                      isBranchSelected
                                        ? 'bg-stone-200/80 dark:bg-stone-700 border-stone-400 dark:border-stone-500 font-medium text-stone-900 dark:text-stone-100'
                                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                                    }`}
                                  >
                                    <span className="truncate">{branch.emoji} {branch.title}</span>
                                    <span className={`text-[10px] ml-2 ${isBranchSelected ? 'font-bold' : 'text-stone-400'}`}>
                                      {isBranchSelected ? 'Included' : '+ Add'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                    03. Curriculum Synthesis Preview
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Review your tailored parameters. The engine will generate an adaptive 3-phase practice schedule.
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-700 pb-3">
                    <span className="font-mono text-xs uppercase text-stone-500 dark:text-stone-400">
                      Target Bundle Name
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {name.trim() || 'Custom Operator Bundle'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-stone-500 dark:text-stone-400 block">Climate</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 capitalize">{climate}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-stone-500 dark:text-stone-400 block">Role</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 capitalize">{profession.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-stone-500 dark:text-stone-400 block">Threat Level</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 capitalize">{riskLevel}</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200/70 dark:border-stone-700 pt-3">
                    <span className="font-mono text-[10px] uppercase text-stone-500 dark:text-stone-400 block mb-1.5">
                      Included Packets ({selectedPacketIds.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPacketIds.map(pId => {
                        const found = packets.find(p => p.id === pId);
                        return (
                          <span 
                            key={pId}
                            className="text-xs bg-stone-200/80 dark:bg-stone-700 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg font-medium"
                          >
                            {found ? found.title : pId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-start space-x-2">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Phase 1 (Days 1–7): Immediate Triage & Baseline Muscle Memory Drills</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Phase 2 (Days 8–21): Core Procedures, Navigation & Non-Electric Repairs</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Phase 3 (Days 22–30): Unscripted High-Stress Scenarios & Verification Tests</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4.5 sm:px-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/60 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px]"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && selectedPacketIds.length === 0}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer shadow-xs min-h-[44px]"
              >
                <Sparkles size={16} />
                <span>{isGenerating ? 'Synthesizing Plan...' : 'Generate Tailored Plan'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

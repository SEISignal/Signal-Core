'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  MapPin, 
  Briefcase, 
  AlertTriangle, 
  Check, 
  Printer, 
  Copy, 
  Share2, 
  Layers, 
  Flame, 
  ChevronDown, 
  ChevronUp,
  Award
} from 'lucide-react';
import { CustomBundle, PracticeDrill, PlanPhase } from '@/lib/bundleTypes';

interface BundleDetailViewProps {
  bundle: CustomBundle;
  onBack: () => void;
  onUpdateBundle: (updated: CustomBundle) => void;
  onOpenExportFallback?: (planText?: string) => void;
}

export function BundleDetailView({
  bundle,
  onBack,
  onUpdateBundle,
  onOpenExportFallback
}: BundleDetailViewProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [activeDrillForTimer, setActiveDrillForTimer] = useState<PracticeDrill | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  // Calculate total drills and completed count
  const allDrills: PracticeDrill[] = bundle.phases.flatMap(p => p.drills);
  const completedCount = allDrills.filter(d => bundle.completedDrillIds.includes(d.id)).length;
  const progressPercent = allDrills.length > 0 ? Math.round((completedCount / allDrills.length) * 100) : 0;

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimerSecondsLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleDrillCompletion = (drillId: string) => {
    const isCompleted = bundle.completedDrillIds.includes(drillId);
    const newCompleted = isCompleted
      ? bundle.completedDrillIds.filter(id => id !== drillId)
      : [...bundle.completedDrillIds, drillId];

    onUpdateBundle({
      ...bundle,
      completedDrillIds: newCompleted
    });
  };

  const startTimerForDrill = (drill: PracticeDrill) => {
    setActiveDrillForTimer(drill);
    setTimerSecondsLeft(drill.durationMinutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateMarkdownPlan = (): string => {
    let text = `# SIGNAL CORE — OPERATIONAL BUNDLE PLAN\n`;
    text += `Bundle: ${bundle.name}\n`;
    text += `Created: ${bundle.createdAt} | Climate: ${bundle.climate} | Role: ${bundle.profession} | Threat: ${bundle.riskLevel}\n`;
    text += `Estimated Practice Hours: ${bundle.totalEstimatedHours} hrs | Progress: ${progressPercent}%\n\n`;
    text += `OPERATIONAL CONTEXT:\n${bundle.description}\n\n`;

    bundle.phases.forEach(phase => {
      text += `========================================================\n`;
      text += `PHASE ${phase.phaseNumber}: ${phase.name.toUpperCase()}\n`;
      text += `Timeframe: ${phase.timeframe}\n`;
      text += `Focus: ${phase.focus}\n\n`;
      text += `MILESTONES:\n`;
      phase.milestones.forEach(m => {
        text += `[ ] ${m}\n`;
      });
      text += `\nPRACTICE DRILLS:\n`;
      phase.drills.forEach(d => {
        const check = bundle.completedDrillIds.includes(d.id) ? '[X]' : '[ ]';
        text += `\n${check} ${d.title} (${d.durationMinutes}m - ${d.frequency} - ${d.difficulty})\n`;
        text += `    Equipment: ${d.equipmentNeeded.join(', ') || 'None required'}\n`;
        d.instructions.forEach((ins, idx) => {
          text += `    ${idx + 1}. ${ins}\n`;
        });
        if (d.environmentNote) {
          text += `    * Note: ${d.environmentNote}\n`;
        }
      });
      text += `\n`;
    });

    return text;
  };

  const handleCopyPlan = () => {
    const text = generateMarkdownPlan();
    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer w-fit min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>Back to Knowledge Library</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyPlan}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium transition-colors cursor-pointer min-h-[44px]"
          >
            {copiedPlan ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedPlan ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrintPlan}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium transition-colors cursor-pointer min-h-[44px]"
          >
            <Printer size={14} />
            <span>Print Sheet</span>
          </button>

          {onOpenExportFallback && (
            <button
              onClick={() => onOpenExportFallback(generateMarkdownPlan())}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-xs font-semibold transition-colors cursor-pointer shadow-xs min-h-[44px]"
            >
              <FileText size={14} />
              <span>Offline Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bundle Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                Active Bundle Plan
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Created: {bundle.createdAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {bundle.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              {bundle.description}
            </p>
          </div>

          {/* Progress Gauge */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 sm:p-5 border border-stone-200/70 dark:border-stone-700/60 shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase text-stone-500 dark:text-stone-400">
                Drill Readiness
              </span>
              <span className="font-mono font-bold text-base text-stone-900 dark:text-stone-100 tabular-nums">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 dark:text-stone-400">
              <span>{completedCount} / {allDrills.length} Drills Verified</span>
              <span>~{bundle.totalEstimatedHours} hrs curriculum</span>
            </div>
          </div>
        </div>

        {/* Environmental Parameters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              <MapPin size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 dark:text-stone-500 block">Climate Profile</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 capitalize">{bundle.climate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              <Briefcase size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 dark:text-stone-500 block">Operator Role</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 capitalize">{bundle.profession.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-xl bg-stone-200/60 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              <AlertTriangle size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 dark:text-stone-500 block">Threat Matrix</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 capitalize">{bundle.riskLevel} Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Field Drill Stopwatch / Timer Bar (if active) */}
      {activeDrillForTimer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-800"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-stone-800 rounded-2xl text-emerald-400 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  Field Drill in Progress
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-xs font-mono text-stone-400">
                  {activeDrillForTimer.category}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {activeDrillForTimer.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-4">
            <span className="font-mono text-3xl font-extrabold tracking-wider tabular-nums text-emerald-300">
              {formatTime(timerSecondsLeft)}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSecondsLeft(activeDrillForTimer.durationMinutes * 60);
                }}
                className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Reset timer"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={() => {
                  toggleDrillCompletion(activeDrillForTimer.id);
                  setActiveDrillForTimer(null);
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer min-h-[44px] flex items-center space-x-1.5"
              >
                <Check size={16} />
                <span>Finish & Log</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Curriculum Phase Selector Tabs */}
      <div className="flex items-center space-x-2 p-1.5 bg-stone-200/60 dark:bg-stone-800/60 rounded-2xl overflow-x-auto">
        {bundle.phases.map((phase, idx) => {
          const isPhaseActive = activePhaseIndex === idx;
          const phaseDrills = phase.drills;
          const phaseCompleted = phaseDrills.filter(d => bundle.completedDrillIds.includes(d.id)).length;

          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setActivePhaseIndex(idx)}
              className={`flex-1 min-w-[180px] p-3 rounded-xl text-left transition-all cursor-pointer min-h-[44px] ${
                isPhaseActive
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span>Phase 0{phase.phaseNumber}</span>
                <span className="font-mono text-[10px] opacity-75">{phaseCompleted}/{phaseDrills.length} Done</span>
              </div>
              <div className="text-xs truncate font-bold mt-0.5">
                {phase.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Content */}
      {bundle.phases[activePhaseIndex] && (
        <div className="space-y-6">
          {/* Phase Summary Banner */}
          <div className="bg-stone-100/70 dark:bg-stone-800/40 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {bundle.phases[activePhaseIndex].timeframe}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {bundle.phases[activePhaseIndex].drills.length} Structured Drills
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {bundle.phases[activePhaseIndex].focus}
            </p>

            {/* Milestones list */}
            <div className="pt-3 border-t border-stone-200/70 dark:border-stone-700/60">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-2">
                Phase Readiness Milestones:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bundle.phases[activePhaseIndex].milestones.map((m, mIdx) => (
                  <div 
                    key={mIdx}
                    className="flex items-start space-x-2 text-xs text-stone-700 dark:text-stone-300 bg-white/70 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-800/50"
                  >
                    <Award size={14} className="text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drill Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Practice Drills ({bundle.phases[activePhaseIndex].drills.length})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {bundle.phases[activePhaseIndex].drills.map((drill) => {
                const isCompleted = bundle.completedDrillIds.includes(drill.id);

                return (
                  <div
                    key={drill.id}
                    className={`bg-white dark:bg-stone-900 rounded-3xl border transition-all p-6 ${
                      isCompleted 
                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10' 
                        : 'border-stone-200 dark:border-stone-800 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-semibold text-stone-900 dark:text-stone-100">
                            {drill.category}
                          </span>
                          <span className="text-stone-300 dark:text-stone-700">·</span>
                          <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                            {drill.durationMinutes} mins
                          </span>
                          <span className="text-stone-300 dark:text-stone-700">·</span>
                          <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                            {drill.frequency}
                          </span>
                          <span className="text-stone-300 dark:text-stone-700">·</span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                            {drill.difficulty}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                          {drill.title}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {drill.description}
                        </p>
                      </div>

                      {/* Drill Status / Action Buttons */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => startTimerForDrill(drill)}
                          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
                        >
                          <Play size={14} />
                          <span>Start Timer ({drill.durationMinutes}m)</span>
                        </button>

                        <button
                          onClick={() => toggleDrillCompletion(drill.id)}
                          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                            isCompleted
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Step-by-step Execution Steps */}
                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800 space-y-2 mt-4 text-xs">
                      <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-stone-500 dark:text-stone-400 block">
                        Drill Execution Steps:
                      </span>
                      <ol className="list-decimal list-inside space-y-1.5 text-stone-700 dark:text-stone-300">
                        {drill.instructions.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Equipment & Environmental Note Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      <div>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">Equipment Needed: </span>
                        <span>{drill.equipmentNeeded.length > 0 ? drill.equipmentNeeded.join(', ') : 'None required'}</span>
                      </div>
                      {drill.environmentNote && (
                        <div className="text-amber-700 dark:text-amber-400 font-sans text-xs">
                          💡 {drill.environmentNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

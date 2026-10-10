'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, ShieldCheck, Award, RefreshCw, Download, FileText, 
  CheckCircle2, Sparkles, Edit3, Settings, AlertCircle, ChevronRight,
  Brain, Stethoscope, Navigation, Droplets, Activity, Zap
} from 'lucide-react';
import { Packet } from '@/lib/data';

export interface CapabilitySkill {
  skill: string;
  status: string;
  color: string;
  dot: string;
}

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  skills: CapabilitySkill[];
  onUpdateSkillStatus: (skillName: string, newStatus: string) => void;
  onOpenTest: () => void;
  onOpenExportFallback: () => void;
  packets: Packet[];
  onDownloadAllPackets: () => void;
  onOpenArchitecture?: () => void;
}

export default function UserProfileDrawer({
  isOpen,
  onClose,
  skills,
  onUpdateSkillStatus,
  onOpenTest,
  onOpenExportFallback,
  packets,
  onDownloadAllPackets,
  onOpenArchitecture
}: UserProfileDrawerProps) {
  const [operatorName, setOperatorName] = useState('Signal-01 (Alex Chen)');
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'functions'>('profile');
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  // Calculate readiness score
  const functionalCount = skills.filter(s => s.status === 'Functional' || s.status === 'Strong').length;
  const readinessPercent = Math.round((functionalCount / skills.length) * 100);

  const downloadedPacketsCount = packets.filter(p => p.status === 'downloaded').length;

  const handleStatusChange = (skillName: string, status: string) => {
    onUpdateSkillStatus(skillName, status);
    setStatusMenuOpen(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-stone-50 border-l border-stone-200 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200/80 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                  AC
                </div>
                <div>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      autoFocus
                      className="text-sm font-bold bg-stone-100 px-2 py-1 rounded border border-stone-300 outline-none text-stone-900"
                    />
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-stone-900">{operatorName}</h3>
                      <button 
                        onClick={() => setIsEditingName(true)} 
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
                        title="Edit Call Sign"
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs font-mono text-stone-500 flex items-center mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    Offline Ready • Clearance Lv. 3
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Close Profile"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Drawer Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-100/70 p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'skills'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Capability Profile
              </button>
              <button
                onClick={() => setActiveTab('functions')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'functions'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                User Functions
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Tab 1: Profile Overview */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Readiness Banner */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                        Overall Resilience Rating
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {readinessPercent}% Ready
                      </span>
                    </div>

                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${readinessPercent}%` }}
                      />
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      Your capability profile measures offline survival and problem-solving readiness under infrastructure constraints.
                    </p>
                  </div>

                  {/* Primary Call to Action: Take Skill Test */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-5 text-stone-100 shadow-sm space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold uppercase">
                      <Sparkles size={14} />
                      <span>Interactive Assessment</span>
                    </div>
                    <h4 className="font-semibold text-sm">Test Your Resilience Skills</h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Evaluate your emergency knowledge through rapid scenario testing to update your capability score.
                    </p>
                    <button
                      onClick={onOpenTest}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <Brain size={14} />
                      <span>Start Readiness Test</span>
                    </button>
                  </div>

                  {/* Offline Storage Summary */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider font-mono">
                        Stored Packets
                      </h4>
                      <span className="text-xs font-mono text-stone-500">
                        {downloadedPacketsCount} of {packets.length} downloaded
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 flex items-center justify-between">
                        <span className="text-stone-600">First Aid</span>
                        <CheckCircle2 size={15} className="text-emerald-500" />
                      </div>
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 flex items-center justify-between">
                        <span className="text-stone-600">Water & Sanitation</span>
                        <CheckCircle2 size={15} className="text-emerald-500" />
                      </div>
                    </div>

                    {downloadedPacketsCount < packets.length && (
                      <button
                        onClick={onDownloadAllPackets}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Download size={13} />
                        <span>Download Remaining Packets</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Capability Profile (Selected Element Feature) */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Capability Profile</h3>
                      <p className="text-xs text-stone-500">Self-assess or test your skills</p>
                    </div>
                    <button
                      onClick={onOpenTest}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors flex items-center space-x-1"
                    >
                      <Zap size={12} />
                      <span>Test All</span>
                    </button>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-2.5">
                    {skills.map((cap, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-stone-800">{cap.skill}</span>

                          <div className="relative">
                            <button
                              onClick={() => setStatusMenuOpen(statusMenuOpen === cap.skill ? null : cap.skill)}
                              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors text-xs cursor-pointer"
                            >
                              <span className={`w-2 h-2 rounded-full ${cap.dot}`} />
                              <span className={`text-xs font-semibold uppercase tracking-wide ${cap.color}`}>
                                {cap.status}
                              </span>
                            </button>

                            {/* Dropdown status selector */}
                            {statusMenuOpen === cap.skill && (
                              <div className="absolute right-0 top-8 z-30 w-36 bg-white rounded-xl shadow-lg border border-stone-200 p-1 text-xs space-y-0.5">
                                {[
                                  { label: 'Strong', color: 'text-emerald-600', dot: 'bg-emerald-500' },
                                  { label: 'Functional', color: 'text-green-600', dot: 'bg-green-500' },
                                  { label: 'Needs practice', color: 'text-amber-600', dot: 'bg-amber-500' },
                                  { label: 'Developing', color: 'text-blue-600', dot: 'bg-blue-500' },
                                  { label: 'Not assessed', color: 'text-stone-400', dot: 'bg-stone-300' }
                                ].map((opt) => (
                                  <button
                                    key={opt.label}
                                    onClick={() => handleStatusChange(cap.skill, opt.label)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 flex items-center space-x-2 transition-colors"
                                  >
                                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                                    <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: User Functions */}
              {activeTab === 'functions' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-mono">
                    User Functions & Tools
                  </h3>

                  <div className="space-y-3">
                    {/* Function 1: Skill Testing Quiz */}
                    <button
                      onClick={onOpenTest}
                      className="w-full bg-white hover:bg-stone-100/80 text-left p-4 rounded-2xl border border-stone-200 shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                          <Brain size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900">Run Skill Test</h4>
                          <p className="text-xs text-stone-500">Evaluate capability through scenarios</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-stone-800" />
                    </button>

                    {/* Function 2: Export & Fallback Plan */}
                    <button
                      onClick={onOpenExportFallback}
                      className="w-full bg-white hover:bg-stone-100/80 text-left p-4 rounded-2xl border border-stone-200 shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <FileText size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900">Export & Fallback View</h4>
                          <p className="text-xs text-stone-500">Printable sheets, BLE & offline transfer</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-stone-800" />
                    </button>

                    {/* Function 3: Offline Sync */}
                    <button
                      onClick={onDownloadAllPackets}
                      className="w-full bg-white hover:bg-stone-100/80 text-left p-4 rounded-2xl border border-stone-200 shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Download size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900">Download All Knowledge</h4>
                          <p className="text-xs text-stone-500">Cache all 10 universal core packets</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-stone-800" />
                    </button>

                    {/* Function 4: Architecture & 3 Pillars Documentation */}
                    {onOpenArchitecture && (
                      <button
                        onClick={onOpenArchitecture}
                        className="w-full bg-white hover:bg-stone-100/80 text-left p-4 rounded-2xl border border-stone-200 shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-stone-900 text-stone-100 group-hover:bg-emerald-600 transition-colors">
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-stone-900">Architecture & Purpose</h4>
                            <p className="text-xs text-stone-500">The 3 Pillars: Pre-assembled, Custom, & Local AI</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-stone-400 group-hover:text-stone-800" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-white text-center">
              <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                SIGNAL Core • User Capability System v1.2
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

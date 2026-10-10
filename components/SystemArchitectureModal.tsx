'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Layers, Package, Cpu, ShieldCheck, Download, 
  ArrowRight, Sparkles, FileText, QrCode, Bluetooth, Info, Radio, Zap
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExport?: () => void;
}

export default function SystemArchitectureModal({
  isOpen,
  onClose,
  onOpenExport
}: SystemArchitectureModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xl space-y-6 relative overflow-hidden my-8"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-mono font-semibold text-stone-700 uppercase tracking-widest">
                  SEIHouse Architecture Spec
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  Signal Core Purpose & System Design
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  The human continuity layer designed to package and serve critical intelligence when centralized infrastructure fails.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close Architecture Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Core Philosophy Banner */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <span className="font-semibold text-stone-900">Core Principle: </span>
              Technology should expand human capability, not erase the fallback. Signal Core operates on three foundational pillars:
            </div>

            {/* The 3 Pillars Cards */}
            <div className="space-y-4">
              {/* Pillar 1 */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-2.5 hover:border-stone-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center text-xs font-mono font-bold">
                      01
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        Pre-Assembled Knowledge Packages
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                        Active & In Use
                      </span>
                    </div>
                  </div>
                  <Package size={18} className="text-stone-400" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Curated, field-vetted capability packets ready for instant offline download. Covers Universal Human Core subjects: CPR and wound management, water purification, terrain navigation, shelter building, mechanical repair, and emergency communication.
                </p>
                <div className="text-[11px] font-mono text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                  • Branching diagnostic trees • Step-by-step emergency sequence checklists • &ldquo;Understand the Why&rdquo; cognitive models
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-2.5 hover:border-stone-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center text-xs font-mono font-bold">
                      02
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        User Information Packaging Engine
                      </h3>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                        Bring Your Own Data
                      </span>
                    </div>
                  </div>
                  <Layers size={18} className="text-stone-400" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You bring your sensitive operational data—household emergency contacts, critical medical profiles, and safe-zone GPS coordinates. Signal Core packages it into resilient, downloadable, and physically transferable formats.
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-stone-600">
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60 flex items-center gap-1.5">
                    <FileText size={12} className="text-stone-700 shrink-0" />
                    <span>Stark Print</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60 flex items-center gap-1.5">
                    <QrCode size={12} className="text-stone-700 shrink-0" />
                    <span>Vector QR</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-xl border border-stone-200/60 flex items-center gap-1.5">
                    <Bluetooth size={12} className="text-stone-700 shrink-0" />
                    <span>BLE Peer Radio</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-850 rounded-2xl p-5 text-stone-100 shadow-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center text-xs font-mono font-black">
                      03
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Local Edge AI (1B–3B SLM) Ingestion Target
                      </h3>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/70 font-semibold">
                        Architectural Target
                      </span>
                    </div>
                  </div>
                  <Cpu size={18} className="text-emerald-400" />
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Small Language Models (1B–3B parameter models) are designed to run on severe, low-power edge hardware (under 5–15W, on battery or solar). Signal Core serves as the structured knowledge substrate so the local AI can ingest either pre-packaged packs or user schemas to deliver straight-to-the-point assistance during disasters.
                </p>
                <div className="text-[11px] font-mono text-stone-400 bg-black/40 p-2.5 rounded-xl border border-stone-800">
                  ⚡ Zero internet required • Zero hallucinations via grounded RAG • High-urgency natural language answers
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
              <span className="text-[11px] font-mono text-stone-400">
                Specification: SIGNAL_CORE_FALLBACK_V1
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onOpenExport && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenExport();
                    }}
                    className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Open Packaging Tool (Pillar 2)
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

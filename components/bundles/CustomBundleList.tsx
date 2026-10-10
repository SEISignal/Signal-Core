'use client';

import React from 'react';
import { 
  Plus, 
  Layers, 
  MapPin, 
  Briefcase, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CustomBundle } from '@/lib/bundleTypes';

interface CustomBundleListProps {
  bundles: CustomBundle[];
  onSelectBundle: (bundleId: string) => void;
  onOpenCreateModal: () => void;
  onDeleteBundle: (bundleId: string) => void;
}

export function CustomBundleList({
  bundles,
  onSelectBundle,
  onOpenCreateModal,
  onDeleteBundle
}: CustomBundleListProps) {
  if (bundles.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 mx-auto flex items-center justify-center">
          <Layers size={32} strokeWidth={1.5} />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            No Custom Bundles Assembled
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Create tailored skill packets adapted to your specific geographic climate, professional responsibilities, and anticipated threat levels. The system will synthesize a custom 3-phase training curriculum.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs hover:bg-stone-800 dark:hover:bg-white transition-all cursor-pointer shadow-xs min-h-[44px]"
          >
            <Plus size={16} />
            <span>Create Custom Skill Bundle</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Custom Skill Bundles ({bundles.length})
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Personalized curricula adapted to your climate, profession, and threat profile.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer shadow-xs min-h-[44px]"
        >
          <Plus size={16} />
          <span>New Bundle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map(bundle => {
          const allDrills = bundle.phases.flatMap(p => p.drills);
          const completedCount = allDrills.filter(d => bundle.completedDrillIds.includes(d.id)).length;
          const progressPercent = allDrills.length > 0 ? Math.round((completedCount / allDrills.length) * 100) : 0;

          return (
            <div
              key={bundle.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-xs group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                      Custom Curriculum
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {bundle.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete custom bundle "${bundle.name}"?`)) {
                        onDeleteBundle(bundle.id);
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Delete bundle"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {bundle.description}
                </p>

                {/* Parameters tags */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 dark:text-stone-400 font-mono">
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md capitalize">
                    📍 {bundle.climate}
                  </span>
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md capitalize">
                    💼 {bundle.profession.replace('_', ' ')}
                  </span>
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md capitalize">
                    ⚠️ {bundle.riskLevel} risk
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500 dark:text-stone-400">Drill Progress</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {completedCount} / {allDrills.length} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action bottom button */}
              <div className="pt-5 mt-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
                  ~{bundle.totalEstimatedHours} hrs total
                </span>

                <button
                  onClick={() => onSelectBundle(bundle.id)}
                  className="flex items-center space-x-1 text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <span>Open Training Plan</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

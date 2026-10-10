'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { packets as initialPackets, capabilityProfile as initialCapabilityProfile, Packet, PacketBranch } from '@/lib/data';
import { 
  ChevronLeft, Download, ShieldAlert, CheckCircle2, ChevronRight, 
  Activity, Zap, User, Sparkles, Brain, FileText, Search, X, 
  Wifi, WifiOff, Compass, ShieldCheck, Layers, Award
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import UserProfileDrawer, { CapabilitySkill } from '@/components/UserProfileDrawer';
import CapabilityTestModal from '@/components/CapabilityTestModal';
import ExportFallbackView from '@/components/ExportFallbackView';
import SystemArchitectureModal from '@/components/SystemArchitectureModal';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type CategoryFilter = 'All' | 'Medical' | 'Survival' | 'Navigation' | 'Technical' | 'Mindset';

const CATEGORY_MAP: Record<CategoryFilter, string[]> = {
  All: [],
  Medical: ['first-aid'],
  Survival: ['water-sanitation', 'shelter', 'weather', 'power'],
  Navigation: ['navigation'],
  Technical: ['repair', 'comms'],
  Mindset: ['reasoning', 'learning'],
};

function subscribeToOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getServerOnlineSnapshot() {
  return true;
}

export default function SignalCoreApp() {
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [skills, setSkills] = useState<CapabilitySkill[]>(initialCapabilityProfile);
  const [packetsList, setPacketsList] = useState<Packet[]>(initialPackets);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  
  // Hydration-safe external store subscription: guarantees identical server & client initial render
  const isBrowserOnline = useSyncExternalStore(subscribeToOnlineStatus, getOnlineSnapshot, getServerOnlineSnapshot);
  const [manualOfflineOverride, setManualOfflineOverride] = useState<boolean | null>(null);

  const isOffline = manualOfflineOverride !== null ? manualOfflineOverride : !isBrowserOnline;

  const toggleOfflineMode = () => {
    setManualOfflineOverride((prev) => (prev !== null ? !prev : isBrowserOnline));
  };

  // Modal / Drawer controls
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isExportFallbackOpen, setIsExportFallbackOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  // Update skill status handler
  const handleUpdateSkillStatus = (skillName: string, newStatus: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.skill === skillName) {
          let color = 'text-green-600';
          let dot = 'bg-green-500';
          if (newStatus === 'Strong') {
            color = 'text-emerald-600';
            dot = 'bg-emerald-500';
          } else if (newStatus === 'Needs practice') {
            color = 'text-amber-600';
            dot = 'bg-amber-500';
          } else if (newStatus === 'Developing') {
            color = 'text-blue-600';
            dot = 'bg-blue-500';
          } else if (newStatus === 'Not assessed') {
            color = 'text-stone-400';
            dot = 'bg-stone-300';
          }
          return { ...s, status: newStatus, color, dot };
        }
        return s;
      })
    );
  };

  // Complete capability test handler
  const handleCompleteTest = (score: number) => {
    if (score >= 2) {
      handleUpdateSkillStatus('First aid', 'Strong');
      handleUpdateSkillStatus('Offline navigation', 'Functional');
      handleUpdateSkillStatus('Water & sanitation', 'Strong');
    } else {
      handleUpdateSkillStatus('First aid', 'Functional');
      handleUpdateSkillStatus('Offline navigation', 'Developing');
    }
  };

  // Download all packets handler
  const handleDownloadAllPackets = () => {
    setPacketsList((prev) => prev.map((p) => ({ ...p, status: 'downloaded' as const })));
  };

  // Calculate readiness score
  const functionalCount = skills.filter((s) => s.status === 'Functional' || s.status === 'Strong').length;
  const readinessPercent = Math.round((functionalCount / skills.length) * 100);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200 antialiased">
      {/* Apple-grade Sticky Translucent Header */}
      <Header
        selectedPacket={selectedPacket}
        onBack={() => setSelectedPacket(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
        skills={skills}
        isOffline={isOffline}
        onToggleOffline={toggleOfflineMode}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        <AnimatePresence mode="wait">
          {!selectedPacket ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Apple-styled Hero Section */}
              <section className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 border border-stone-300/60 text-[11px] font-mono font-medium text-stone-700 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    <span>SEIHOUSE • SIGNAL PROTOCOL</span>
                  </div>
                  <button
                    onClick={() => setIsArchModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-[11px] font-mono font-semibold text-emerald-800 tracking-tight transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Sparkles size={11} className="text-emerald-600" />
                    <span>System Architecture & 3 Pillars</span>
                    <ChevronRight size={11} className="text-emerald-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                    Offline Resilience Intelligence
                  </h1>
                  <p className="text-stone-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Zero-grid knowledge packaging: pre-assembled universal directive packs, user-customized emergency data packaging, and a grounding layer for low-power local Edge AI (1B–3B SLMs).
                  </p>
                </div>

                {/* Quick Capability & Offline Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-medium">Readiness Rating</span>
                      <Award size={14} className="text-emerald-600" />
                    </div>
                    <div className="text-xl font-bold tracking-tight text-stone-900">{readinessPercent}%</div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${readinessPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-medium">Stored Packets</span>
                      <CheckCircle2 size={14} className="text-stone-600" />
                    </div>
                    <div className="text-xl font-bold tracking-tight text-stone-900">
                      {packetsList.filter((p) => p.status === 'downloaded').length} / {packetsList.length}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-2 font-mono">100% Client Cached</div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-medium">Operating Mode</span>
                      {isOffline ? (
                        <WifiOff size={14} className="text-amber-600" />
                      ) : (
                        <Wifi size={14} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="text-xl font-bold tracking-tight text-stone-900">
                      {isOffline ? 'Offline Grid' : 'Network Active'}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-2 font-mono">
                      {isOffline ? 'Isolated local sandbox' : 'Peer sync enabled'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Packet Library Grid */}
              <PacketLibrary
                packets={packetsList}
                onSelect={setSelectedPacket}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
            </motion.div>
          ) : (
            <PacketDetail
              key="detail"
              packet={selectedPacket}
              onBack={() => setSelectedPacket(null)}
              onOpenExportFallback={() => setIsExportFallbackOpen(true)}
              onOpenTest={() => setIsTestOpen(true)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Apple-style minimalist footer */}
      <footer className="border-t border-stone-200/70 bg-stone-100/50 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900 tracking-tight">SIGNAL CORE</span>
            <span>•</span>
            <span>SEIHouse Resilient Architecture Division</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="text-stone-700 hover:text-stone-950 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
            >
              System Architecture & 3 Pillars Spec
            </button>
            <span className="text-stone-300">•</span>
            <span className="text-stone-400">Offline Spec v1.4</span>
          </div>
        </div>
      </footer>

      {/* User Profile Drawer */}
      <UserProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        skills={skills}
        onUpdateSkillStatus={handleUpdateSkillStatus}
        onOpenTest={() => {
          setIsProfileOpen(false);
          setIsTestOpen(true);
        }}
        onOpenExportFallback={() => {
          setIsProfileOpen(false);
          setIsExportFallbackOpen(true);
        }}
        onOpenArchitecture={() => {
          setIsProfileOpen(false);
          setIsArchModalOpen(true);
        }}
        packets={packetsList}
        onDownloadAllPackets={handleDownloadAllPackets}
      />

      {/* Capability Testing Modal */}
      <CapabilityTestModal
        isOpen={isTestOpen}
        onClose={() => setIsTestOpen(false)}
        onCompleteTest={handleCompleteTest}
      />

      {/* System Architecture & 3 Pillars Modal */}
      <SystemArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        onOpenExport={() => setIsExportFallbackOpen(true)}
      />

      {/* Export Fallback View Modal */}
      <AnimatePresence>
        {isExportFallbackOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md flex justify-center">
            <div className="w-full max-w-4xl bg-stone-950 text-white min-h-screen relative">
              <button
                onClick={() => setIsExportFallbackOpen(false)}
                className="fixed top-4 right-4 z-50 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full border border-zinc-700 shadow-xl transition-colors cursor-pointer"
                aria-label="Close Export"
              >
                ✕
              </button>
              <ExportFallbackView onClose={() => setIsExportFallbackOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({
  selectedPacket,
  onBack,
  onOpenProfile,
  skills,
  isOffline,
  onToggleOffline,
  onOpenArchitecture,
}: {
  selectedPacket: Packet | null;
  onBack: () => void;
  onOpenProfile: () => void;
  skills: CapabilitySkill[];
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenArchitecture: () => void;
}) {
  const functionalCount = skills.filter((s) => s.status === 'Functional' || s.status === 'Strong').length;
  const percent = Math.round((functionalCount / skills.length) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-stone-50/85 backdrop-blur-xl border-b border-stone-200/60 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AnimatePresence mode="popLayout">
            {selectedPacket && (
              <motion.button
                initial={{ opacity: 0, x: -8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                onClick={onBack}
                className="p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-200/60 cursor-pointer active:scale-95"
                aria-label="Back to Library"
              >
                <ChevronLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-stone-900 font-sans">
                  SIGNAL
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-medium px-1.5 py-0.5 rounded bg-stone-200/50">
                  CORE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Header Controls */}
        <div className="flex items-center space-x-2">
          {/* Architecture 3 Pillars Spec Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border border-stone-200/90 bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Signal Core System Architecture & 3 Pillars"
          >
            <Sparkles size={12} className="text-emerald-600" />
            <span>3 Pillars Spec</span>
          </button>

          {/* Quick Offline Status Simulation Toggle Chip */}
          <button
            onClick={onToggleOffline}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer active:scale-95 shadow-2xs",
              isOffline
                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            )}
            title={isOffline ? "Currently in Disconnected Mode. Click to simulate network restoration." : "Currently Online. Click to simulate offline disconnected mode."}
          >
            {isOffline ? (
              <>
                <WifiOff size={13} className="text-amber-600 animate-pulse" />
                <span className="text-[11px] font-semibold">Offline</span>
              </>
            ) : (
              <>
                <Wifi size={13} className="text-emerald-600" />
                <span className="text-[11px] font-semibold">Connected</span>
              </>
            )}
          </button>

          {/* Apple-style Profile Button */}
          <button
            onClick={onOpenProfile}
            id="header-profile-button"
            className="group relative flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 pl-2 pr-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer ring-1 ring-stone-800 min-h-[38px]"
            title="Operator Readiness Profile & Settings"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-stone-800 text-stone-100 ring-1 ring-stone-700 shadow-xs">
              <User size={13} className="text-stone-200" strokeWidth={2} />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-3 h-3 rounded-full ring-2 ring-stone-900 transition-all",
                  isOffline ? "bg-amber-400" : "bg-emerald-400"
                )}
              />
            </div>

            <span className="text-xs font-semibold font-mono tracking-tight text-stone-200">
              Signal-01
            </span>

            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 shadow-2xs">
              {percent}%
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function PacketLibrary({
  packets,
  onSelect,
  activeCategory,
  onSelectCategory,
}: {
  packets: Packet[];
  onSelect: (p: Packet) => void;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPackets = useMemo(() => {
    return packets.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'All') return true;
      const validIds = CATEGORY_MAP[activeCategory];
      return validIds.includes(p.id);
    });
  }, [packets, searchQuery, activeCategory]);

  const categories: CategoryFilter[] = ['All', 'Medical', 'Survival', 'Navigation', 'Technical', 'Mindset'];

  return (
    <section className="space-y-6">
      {/* Apple Spotlight Search Bar */}
      <div className="relative">
        <div className="relative flex items-center bg-white rounded-2xl border border-stone-200/90 shadow-2xs focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-900/5 transition-all">
          <Search size={18} className="absolute left-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directives, protocols, and medical instructions..."
            className="w-full pl-11 pr-10 py-3.5 text-sm text-stone-900 bg-transparent placeholder-stone-400 outline-none rounded-2xl font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Apple segmented filter styling) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer",
              activeCategory === cat
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white/80 hover:bg-white text-stone-600 border border-stone-200/80 hover:text-stone-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section Headline */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
            Universal Knowledge Core
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            {searchQuery
              ? `Showing ${filteredPackets.length} result${filteredPackets.length === 1 ? '' : 's'} for "${searchQuery}"`
              : `${filteredPackets.length} emergency directives downloaded and primed for offline access`}
          </p>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredPackets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPackets.map((packet) => {
            const Icon = packet.icon;
            return (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                key={packet.id}
                onClick={() => onSelect(packet)}
                className="group text-left bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all relative overflow-hidden cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-stone-100 p-3 rounded-2xl text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  {packet.status === 'downloaded' ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-medium">
                      <CheckCircle2 size={13} className="text-emerald-600" strokeWidth={2} />
                      <span>OFFLINE READY</span>
                    </div>
                  ) : packet.status === 'update_needed' ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono font-medium">
                      <Zap size={13} className="text-amber-600" strokeWidth={2} />
                      <span>UPDATE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-mono font-medium">
                      <Download size={13} className="text-stone-500" strokeWidth={2} />
                      <span>CACHED</span>
                    </div>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-stone-900 mb-1 leading-snug group-hover:text-black">
                  {packet.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
                  {packet.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>Verified: {packet.lastVerified}</span>
                  <span className="flex items-center text-stone-600 group-hover:translate-x-0.5 transition-transform font-medium">
                    View Directives <ChevronRight size={13} className="ml-0.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-2xs space-y-3">
          <p className="text-sm font-semibold text-stone-800">No matching directives found</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            No knowledge packets match your query &ldquo;{searchQuery}&rdquo;. Try another search term or reset category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
            className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

function getBranchesForPacket(packet: Packet): PacketBranch[] {
  if (packet.branches && packet.branches.length > 0) {
    return packet.branches;
  }

  // Default fallback branches for packets without explicitly defined branches
  const items = packet.emergencyInstructions;
  const mid = Math.ceil(items.length / 2);

  return [
    {
      id: 'branch-1',
      emoji: '🩺',
      title: `${packet.title} Core Operations`,
      subtitle: 'Immediate field procedures and safety steps',
      items: items.slice(0, mid).map((inst, idx) => ({
        id: `b1-${idx}`,
        title: inst,
        description: 'Standard operating directive',
      })),
    },
    {
      id: 'branch-2',
      emoji: '🛡️',
      title: 'Risk Control & Mitigation',
      subtitle: 'Secondary precautions and environmental measures',
      items: items.slice(mid).map((inst, idx) => ({
        id: `b2-${idx}`,
        title: inst,
        description: 'Safety precaution & containment procedure',
      })),
    },
  ];
}

function PacketDetail({
  packet,
  onBack,
  onOpenExportFallback,
  onOpenTest,
}: {
  packet: Packet;
  onBack: () => void;
  onOpenExportFallback: () => void;
  onOpenTest: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const [viewMode, setViewMode] = useState<'branch' | 'sequence'>('branch');

  const branches = getBranchesForPacket(packet);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-stone-100 p-4 rounded-3xl text-stone-900 shrink-0 border border-stone-200/60 shadow-2xs">
            <packet.icon size={30} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                OFFLINE VERIFIED
              </span>
              <span className="text-xs text-stone-400 font-mono">Rev: {packet.lastVerified}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-1">
              {packet.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExportFallback}
            className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <FileText size={14} />
            <span>Export Plan</span>
          </button>
        </div>
      </div>

      {/* Apple-style Segmented View Toggle */}
      <div className="flex items-center justify-between bg-stone-200/70 p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setViewMode('branch')}
          className={cn(
            "flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer",
            viewMode === 'branch'
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          )}
        >
          <span className="font-mono font-bold">🌿 Branching Hierarchy</span>
        </button>
        <button
          onClick={() => setViewMode('sequence')}
          className={cn(
            "flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer",
            viewMode === 'sequence'
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          )}
        >
          <span className="font-mono">📋 Sequential Directives</span>
        </button>
      </div>

      {/* Main Branching View */}
      {viewMode === 'branch' ? (
        <motion.div
          key="branching-view"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          className="space-y-6"
        >
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 relative overflow-hidden"
            >
              {/* Branch Title */}
              <div className="flex items-start space-x-3.5 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 text-xl flex items-center justify-center shrink-0 border border-stone-200/60 shadow-2xs">
                  {branch.emoji}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                    {branch.title}
                  </h3>
                  {branch.subtitle && (
                    <p className="text-xs text-stone-500 font-sans mt-0.5">{branch.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Branch Tree */}
              <div className="relative pl-6 sm:pl-8 ml-3 sm:ml-4 border-l-2 border-dashed border-stone-300 space-y-4">
                {branch.items.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-stone-900 group-hover:border-emerald-600 group-hover:bg-emerald-500 transition-colors shadow-2xs" />

                    <div className="bg-stone-50/80 hover:bg-stone-100/90 p-4 rounded-2xl border border-stone-200/70 transition-all hover:shadow-2xs">
                      <div className="flex items-start space-x-2">
                        <span className="text-stone-400 font-mono text-xs mt-0.5 select-none">•</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      {item.description && (
                        <p className="text-xs text-stone-600 mt-1.5 pl-4 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        /* Sequential Directives View */
        <motion.div
          key="sequential-view"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col"
        >
          <div className="flex items-center text-red-600 mb-6 font-semibold tracking-wide uppercase text-xs font-mono">
            <ShieldAlert size={18} className="mr-2" />
            Sequential Emergency Directives
          </div>
          <ul className="space-y-3.5">
            {packet.emergencyInstructions.map((inst, i) => (
              <li key={i} className="flex items-start bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold mr-3 mt-0.5 font-mono">
                  {i + 1}
                </span>
                <span className="text-stone-800 leading-relaxed font-medium text-xs sm:text-sm">
                  {inst}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Understand the Why Section (Cognitive context) */}
      <div className="pt-2">
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="group w-full bg-white hover:bg-stone-100/80 border border-stone-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-stone-800 flex items-center gap-2">
            <Brain size={16} className="text-stone-600" />
            <span>Deep Conceptual Context (&ldquo;Understand the Why&rdquo;)</span>
          </span>
          <ChevronRight
            size={16}
            className={cn(
              "text-stone-400 group-hover:text-stone-800 transition-transform duration-300",
              showWhy && "rotate-90"
            )}
          />
        </button>

        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden space-y-4 mt-4"
            >
              <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-2xs text-stone-700 leading-relaxed">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3 font-mono">
                  Core Scientific Principle
                </h3>
                <p className="text-sm sm:text-base text-stone-800 font-medium">
                  {packet.learningContent}
                </p>
              </div>

              {packet.scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-stone-50 border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-2xs"
                >
                  <div className="flex items-center text-indigo-600 mb-3 font-semibold tracking-wide uppercase text-xs font-mono">
                    <Activity size={16} className="mr-2" />
                    Practical Context & Application
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-stone-900 mb-3">
                    {scenario.question}
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 mb-3">
                    <div className="flex items-start">
                      <CheckCircle2 size={18} className="text-emerald-500 mr-2.5 mt-0.5 shrink-0" />
                      <span className="text-stone-900 font-medium text-xs sm:text-sm">
                        {scenario.options[scenario.correctIndex]}
                      </span>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
                    <span className="font-semibold text-stone-800 mr-1.5">Why:</span>
                    {scenario.explanation}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

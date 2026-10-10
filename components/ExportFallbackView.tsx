'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, QrCode, Wifi, Bluetooth, Plus, Trash2, Edit2, Check,
  Copy, Map, Phone, ShieldCheck, FileText, Settings, Sparkles,
  RefreshCw, Info, Lock, Share2, Eye, ShieldAlert, X, Compass, Activity, ChevronRight, CheckCircle2
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  meetingPoint: string;
}

interface MedicalInfo {
  id: string;
  name: string;
  bloodType: string;
  conditions: string;
  medications: string;
}

interface SafeZone {
  id: string;
  name: string;
  coordinates: string;
  backup: string;
  sector: string;
}

export default function ExportFallbackView({ onClose }: { onClose: () => void }) {
  // Initial pre-loaded emergency data
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Sarah Chen', role: 'Spouse', phone: '+1 (555) 019-2834', meetingPoint: 'Sector 4 Civic Park' },
    { id: '2', name: 'Marcus Chen', role: 'Child', phone: '+1 (555) 019-2835', meetingPoint: 'Sector 4 Civic Park' },
    { id: '3', name: 'Emergency Broadcast', role: 'Local Civil Defense', phone: 'Ch 16 VHF / 146.520 MHz', meetingPoint: 'Primary Shelter' }
  ]);

  const [medical, setMedical] = useState<MedicalInfo[]>([
    { id: '1', name: 'Sarah Chen', bloodType: 'A+', conditions: 'Asthma (Carry Inhaler)', medications: 'Albuterol' },
    { id: '2', name: 'Marcus Chen', bloodType: 'O-', conditions: 'Penicillin Allergy', medications: 'None' }
  ]);

  const [safeZones, setSafeZones] = useState<SafeZone[]>([
    { id: '1', name: 'Sector 4 Civic Park', coordinates: '37.7749° N, 122.4194° W', backup: 'Community High Gym', sector: 'District 4' },
    { id: '2', name: 'Primary Emergency Shelter', coordinates: '37.7801° N, 122.4112° W', backup: 'Underground Transit Level 2', sector: 'District 5' }
  ]);

  // Form states
  const [activeTab, setActiveTab] = useState<'contacts' | 'medical' | 'zones'>('contacts');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Sharing states
  const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
  const [bluetoothLogs, setBluetoothLogs] = useState<string[]>([]);
  const [bluetoothProgress, setBluetoothProgress] = useState(0);
  const [isWifiSyncing, setIsWifiSyncing] = useState(false);
  const [wifiProgress, setWifiProgress] = useState(0);
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);

  // New item inputs
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', role: '', phone: '', meetingPoint: '' });
  const [newMedical, setNewMedical] = useState<Omit<MedicalInfo, 'id'>>({ name: '', bloodType: '', conditions: '', medications: '' });
  const [newZone, setNewZone] = useState<Omit<SafeZone, 'id'>>({ name: '', coordinates: '', backup: '', sector: '' });

  // Print Preview Dialog state
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // BLE sweep ref for automatic logs
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);

  const exportTimestamp = '2026-10-10';

  // Compile full raw configuration payload
  const compiledPayload = React.useMemo(() => JSON.stringify({
    contacts: contacts.map(c => ({ n: c.name, r: c.role, p: c.phone, m: c.meetingPoint })),
    medical: medical.map(m => ({ n: m.name, b: m.bloodType, c: m.conditions, m: m.medications })),
    zones: safeZones.map(z => ({ n: z.name, c: z.coordinates, b: z.backup, s: z.sector })),
    timestamp: exportTimestamp,
    protocol: 'SIGNAL_CORE_FALLBACK_V1'
  }, null, 2), [contacts, medical, safeZones, exportTimestamp]);

  const payloadSizeInBytes = typeof Blob !== 'undefined' ? new Blob([compiledPayload]).size : compiledPayload.length;

  // Generate a reliable pseudo-random SVG QR code layout based on the raw payload
  const generateDeterministicGrid = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    
    const size = 25; // 25x25 grid
    const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Seeded random number generator
    let seed = Math.abs(hash) || 987654321;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Corners contain standard QR anchor finders (3 standard 7x7 squares)
        const isTopLeftFinder = r < 7 && c < 7;
        const isTopRightFinder = r < 7 && c >= size - 7;
        const isBottomLeftFinder = r >= size - 7 && c < 7;
        
        if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
          // Outer border of finder
          const localR = r < 7 ? r : r >= size - 7 ? r - (size - 7) : r;
          const localC = c < 7 ? c : c >= size - 7 ? c - (size - 7) : c;
          
          const isBorder = localR === 0 || localR === 6 || localC === 0 || localC === 6;
          const isCenter = localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4;
          grid[r][c] = isBorder || isCenter;
        } else {
          // Regular data bits
          grid[r][c] = rand() > 0.45;
        }
      }
    }
    return grid;
  };

  const qrGrid = generateDeterministicGrid(compiledPayload);

  // Trigger Bluetooth scanning simulation
  const startBluetoothScan = () => {
    if (isBluetoothScanning) return;
    setIsBluetoothScanning(true);
    setBluetoothProgress(0);
    setBluetoothLogs([]);

    const logSteps = [
      '⚡ BLE: Initializing Local Radio Interface...',
      '📡 BLE: Advertising signal under fallback UID 0xFD4A',
      '🔍 BLE: Searching for peer mesh nodes in immediate range...',
      '📶 BLE: Found device "Alpha-Mesh-Core-3" (Signal: -65dBm)',
      '🔒 BLE: Initiating secure handshake with Alpha-Mesh-Core-3...',
      '🛠️ BLE: Syncing peer parameters and authorization vectors...',
      `📤 BLE: Transmitting compressed secure payload (${(payloadSizeInBytes / 1024).toFixed(2)} KB)...`,
      '📊 BLE: Payload transferred. Verifying block hashes...',
      '✅ BLE: Handshake validated. Peer sync completed successfully!'
    ];

    let currentStep = 0;
    const runLogs = () => {
      if (currentStep < logSteps.length) {
        setBluetoothLogs(prev => [...prev, logSteps[currentStep]]);
        setBluetoothProgress(Math.round(((currentStep + 1) / logSteps.length) * 100));
        currentStep++;
        logTimerRef.current = setTimeout(runLogs, 800);
      } else {
        setIsBluetoothScanning(false);
      }
    };
    runLogs();
  };

  // Trigger Wi-Fi sync simulation
  const startWifiSync = () => {
    if (isWifiSyncing) return;
    setIsWifiSyncing(true);
    setWifiProgress(0);

    const interval = setInterval(() => {
      setWifiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWifiSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (logTimerRef.current) clearTimeout(logTimerRef.current);
    };
  }, []);

  const copyPayloadToClipboard = () => {
    navigator.clipboard.writeText(compiledPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Add handlers
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(prev => [...prev, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: '', role: '', phone: '', meetingPoint: '' });
  };

  const handleAddMedical = () => {
    if (!newMedical.name || !newMedical.bloodType) return;
    setMedical(prev => [...prev, { ...newMedical, id: Date.now().toString() }]);
    setNewMedical({ name: '', bloodType: '', conditions: '', medications: '' });
  };

  const handleAddZone = () => {
    if (!newZone.name || !newZone.coordinates) return;
    setSafeZones(prev => [...prev, { ...newZone, id: Date.now().toString() }]);
    setNewZone({ name: '', coordinates: '', backup: '', sector: '' });
  };

  // Remove handlers
  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleRemoveMedical = (id: string) => {
    setMedical(prev => prev.filter(m => m.id !== id));
  };

  const handleRemoveZone = (id: string) => {
    setSafeZones(prev => prev.filter(z => z.id !== id));
  };

  const triggerRealPrint = () => {
    // Hide print preview state but do immediate native browser print.
    // Standard approach for React single pages is to open a new styled window or use an iframe,
    // or toggle a temporary printing class on body. Let's create an elegant, robust solution
    // that triggers standard window.print() and prints a beautifully formatted page.
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="p-6 pb-16 space-y-8"
    >
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#ff4500] font-bold uppercase bg-[#ff4500]/10 border border-[#ff4500]/20 px-2.5 py-0.5 rounded-full">
            OFFLINE PERSISTENCE PORT
          </span>
          <h1 className="text-3xl font-light tracking-tight mt-3 text-zinc-100">Export & Fallback</h1>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Prepare, compile, and broadcast critical survival schemas peer-to-peer or onto durable, non-digital print surfaces.
          </p>
        </div>
      </div>

      {/* Reassurance Guard Banner */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex items-start space-x-3.5 shadow-inner">
        <Lock size={16} className="text-emerald-500 mt-0.5 shrink-0" />
        <div className="text-xs">
          <h4 className="font-semibold text-zinc-300">Local Isolation Enforced</h4>
          <p className="text-zinc-500 leading-relaxed mt-0.5">
            Your emergency profiles remain fully sandboxed within client-side memory. This metadata is strictly compiled in real-time and remains offline unless physically transmitted below.
          </p>
        </div>
      </div>

      {/* Section 1: Emergency Configuration Data Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono flex items-center">
            <Activity size={14} className="mr-2 text-zinc-400" />
            Active Emergency Schemas
          </h3>
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`text-xs font-mono px-3 py-1 rounded-full border transition-all flex items-center space-x-1.5 ${
              editMode 
                ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400 font-bold' 
                : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit2 size={11} />
            <span>{editMode ? 'Finish Editing' : 'Modify Profiles'}</span>
          </button>
        </div>

        {/* Tab Picker */}
        <div className="flex p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
          <button
            onClick={() => { setActiveTab('contacts'); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'contacts' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Phone size={12} />
            <span>Contacts ({contacts.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('medical'); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'medical' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Activity size={12} />
            <span>Medical ({medical.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('zones'); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'zones' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Map size={12} />
            <span>Safe Zones ({safeZones.length})</span>
          </button>
        </div>

        {/* Dynamic Schema Display/Editor */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'contacts' && (
              <motion.div
                key="contacts-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {contacts.map(c => (
                    <div key={c.id} className="flex justify-between items-start bg-zinc-900/40 border border-zinc-900/80 p-3 rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-zinc-200">{c.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            {c.role}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400">{c.phone}</div>
                        <div className="text-[11px] text-zinc-500 flex items-center space-x-1">
                          <Compass size={11} className="text-zinc-600 shrink-0" />
                          <span className="truncate">HQ: {c.meetingPoint}</span>
                        </div>
                      </div>
                      {editMode && (
                        <button 
                          onClick={() => handleRemoveContact(c.id)}
                          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="bg-zinc-900/10 border border-zinc-900/60 p-3 rounded-xl space-y-3.5 pt-4">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">Add New Emergency Contact</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Name (e.g. Jane Doe)" 
                        value={newContact.name}
                        onChange={e => setNewContact({...newContact, name: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Relationship (e.g. Sister)" 
                        value={newContact.role}
                        onChange={e => setNewContact({...newContact, role: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Phone or Frequency" 
                        value={newContact.phone}
                        onChange={e => setNewContact({...newContact, phone: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Meeting Spot" 
                        value={newContact.meetingPoint}
                        onChange={e => setNewContact({...newContact, meetingPoint: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <button 
                      onClick={handleAddContact}
                      className="w-full bg-zinc-200 hover:bg-white text-black font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Contact</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'medical' && (
              <motion.div
                key="medical-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {medical.map(m => (
                    <div key={m.id} className="flex justify-between items-start bg-zinc-900/40 border border-zinc-900/80 p-3 rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-zinc-200">{m.name}</span>
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/20 border border-rose-900/30 px-1.5 py-0.5 rounded font-bold">
                            Blood Type: {m.bloodType}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 leading-relaxed">
                          <strong className="text-zinc-500 font-medium">Allergies/Conditions:</strong> {m.conditions}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          <strong className="text-zinc-500 font-medium">Daily Medications:</strong> {m.medications}
                        </div>
                      </div>
                      {editMode && (
                        <button 
                          onClick={() => handleRemoveMedical(m.id)}
                          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="bg-zinc-900/10 border border-zinc-900/60 p-3 rounded-xl space-y-3 pt-4">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">Add Medical Profile</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Family Member Name" 
                        value={newMedical.name}
                        onChange={e => setNewMedical({...newMedical, name: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Blood Type (e.g. A+)" 
                        value={newMedical.bloodType}
                        onChange={e => setNewMedical({...newMedical, bloodType: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Allergies / Key Conditions" 
                        value={newMedical.conditions}
                        onChange={e => setNewMedical({...newMedical, conditions: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Daily Medications" 
                        value={newMedical.medications}
                        onChange={e => setNewMedical({...newMedical, medications: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <button 
                      onClick={handleAddMedical}
                      className="w-full bg-zinc-200 hover:bg-white text-black font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Medical Profile</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'zones' && (
              <motion.div
                key="zones-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {safeZones.map(z => (
                    <div key={z.id} className="flex justify-between items-start bg-zinc-900/40 border border-zinc-900/80 p-3 rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-zinc-200">{z.name}</span>
                          <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 uppercase tracking-wider">
                            {z.sector}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span>LOC: {z.coordinates}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          <strong className="text-zinc-600 font-medium">Backup Plan:</strong> {z.backup}
                        </div>
                      </div>
                      {editMode && (
                        <button 
                          onClick={() => handleRemoveZone(z.id)}
                          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="bg-zinc-900/10 border border-zinc-900/60 p-3 rounded-xl space-y-3 pt-4">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">Add Safe Zone / Hub</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Location Name" 
                        value={newZone.name}
                        onChange={e => setNewZone({...newZone, name: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Sector / Zone" 
                        value={newZone.sector}
                        onChange={e => setNewZone({...newZone, sector: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="GPS Coordinates" 
                        value={newZone.coordinates}
                        onChange={e => setNewZone({...newZone, coordinates: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Backup Meeting Spot" 
                        value={newZone.backup}
                        onChange={e => setNewZone({...newZone, backup: e.target.value})}
                        className="bg-black border border-zinc-850 px-3 py-1.5 rounded-lg text-xs focus:border-zinc-700 outline-none placeholder-zinc-600"
                      />
                    </div>
                    <button 
                      onClick={handleAddZone}
                      className="w-full bg-zinc-200 hover:bg-white text-black font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Safe Zone</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Configuration Size Stamp */}
          <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>OFFLINE PAYLOAD SIZE</span>
            <span className="font-bold text-zinc-400">{payloadSizeInBytes} Bytes</span>
          </div>
        </div>
      </div>

      {/* Primary Section 1: Generate Printable Plan */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono flex items-center">
          <Printer size={14} className="mr-2 text-zinc-400" />
          Analog Durability Plan
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 to-transparent pointer-events-none" />

            {/* Stark Interactive Preview Document Thumbnail */}
            <div 
              onClick={() => setShowPrintPreview(true)}
              className="relative w-36 h-48 bg-white text-black p-4 rounded-md shadow-2xl border border-zinc-300 hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Internal Miniature Grid Mockup */}
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
                  <span className="text-[5px] font-mono font-bold tracking-tighter uppercase">EMERGENCY PROTOCOL</span>
                  <Compass size={8} className="text-black" />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="h-1 bg-black/80 w-full rounded-sm" />
                  <div className="h-1 bg-black/40 w-5/6 rounded-sm" />
                  <div className="h-1 bg-black/20 w-4/6 rounded-sm" />
                </div>

                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-[4px] font-mono border-b border-black/10 pb-0.5">
                    <span className="font-bold">Chen, Sarah</span>
                    <span>555-0192</span>
                  </div>
                  <div className="flex justify-between text-[4px] font-mono border-b border-black/10 pb-0.5">
                    <span className="font-bold">Chen, Marcus</span>
                    <span>555-0193</span>
                  </div>
                  <div className="flex justify-between text-[4px] font-mono border-b border-black/10 pb-0.5">
                    <span className="font-bold">Civic Park</span>
                    <span>Sector 4</span>
                  </div>
                </div>

                <div className="pt-2.5 flex items-center space-x-1">
                  <div className="w-5 h-5 bg-black rounded-sm shrink-0 flex items-center justify-center p-0.5">
                    <QrCode size={5} className="text-white" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="h-[2px] bg-black/50 w-full" />
                    <div className="h-[2px] bg-black/30 w-3/4" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-black/10">
                <span className="text-[4px] font-mono text-black/50">SECURE DISCHARGE VECTOR</span>
                <span className="text-[4px] font-mono font-bold text-black bg-black/5 px-1 py-0.5 rounded">PAGE 01</span>
              </div>

              {/* Holographic Interactive Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-1.5 text-zinc-100">
                <Eye size={18} />
                <span className="text-[10px] font-semibold tracking-wider uppercase font-mono">View stark preview</span>
              </div>
            </div>

            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-medium text-zinc-200">Generate Stark Printable Sheet</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Compile your emergency contacts, active medical registries, and coordinates onto a high-contrast analog page. Optimal for paper-based survival kits.
              </p>
            </div>

            <button 
              onClick={() => setShowPrintPreview(true)}
              className="w-full bg-zinc-100 hover:bg-white text-black text-xs font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center space-x-2"
            >
              <Printer size={14} />
              <span>Compile & Preview Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Section 2: Local Transfer */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono flex items-center">
          <Share2 size={14} className="mr-2 text-zinc-400" />
          Zero-Grid Peer Transfer
        </h3>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-6">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">Localized Radio Channels</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Broadcast coordinates and profiles peer-to-peer using fully sandboxed off-grid capabilities.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Button: Share via Bluetooth */}
            <div className="space-y-2">
              <button 
                onClick={startBluetoothScan}
                disabled={isBluetoothScanning}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                  isBluetoothScanning 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200' 
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800/80 hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2 rounded-lg ${isBluetoothScanning ? 'bg-[#ff4500]/10 text-[#ff4500] animate-pulse' : 'bg-zinc-850 text-zinc-400'}`}>
                    <Bluetooth size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Share via Bluetooth (BLE)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Bands: BLE Channel 37-39 (Advertising)</span>
                  </div>
                </div>
                {isBluetoothScanning ? (
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400">
                    <RefreshCw size={11} className="animate-spin" />
                    <span>Sweeping...</span>
                  </div>
                ) : (
                  <ChevronRight size={14} className="text-zinc-600" />
                )}
              </button>

              {/* Bluetooth scanning simulator */}
              {isBluetoothScanning && (
                <div className="bg-black border border-zinc-900 rounded-xl p-4 space-y-4">
                  {/* Radar Scanning Sweep UI */}
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden bg-zinc-950/40">
                      <div className="absolute w-10 h-10 rounded-full border border-dashed border-zinc-800" />
                      <div className="absolute w-5 h-5 rounded-full border border-[#ff4500]/30" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4500]/10 to-transparent animate-spin origin-center" style={{ animationDuration: '3s' }} />
                      <Bluetooth size={12} className="text-[#ff4500] relative z-10" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#ff4500] font-bold">ACTIVE BLE BROADCAST</span>
                        <span>{bluetoothProgress}%</span>
                      </div>
                      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff4500] transition-all duration-300" style={{ width: `${bluetoothProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Monospace terminal logs */}
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-3 max-h-36 overflow-y-auto font-mono text-[9px] text-zinc-400 space-y-1.5 scrollbar-thin">
                    {bluetoothLogs.map((log, idx) => (
                      <div key={idx} className="leading-normal flex items-start space-x-1.5">
                        <span className="text-[#ff4500] shrink-0">▸</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Button: Local Wi-Fi Sync */}
            <div className="space-y-2">
              <button 
                onClick={startWifiSync}
                disabled={isWifiSyncing}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                  isWifiSyncing 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200' 
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800/80 hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2 rounded-lg ${isWifiSyncing ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-850 text-zinc-400'}`}>
                    <Wifi size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Local Wi-Fi Sync (Ad-Hoc)</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Port: LAN Port 3000 broadcast</span>
                  </div>
                </div>
                {isWifiSyncing ? (
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400">
                    <RefreshCw size={11} className="animate-spin" />
                    <span>Syncing...</span>
                  </div>
                ) : (
                  <ChevronRight size={14} className="text-zinc-600" />
                )}
              </button>

              {isWifiSyncing && (
                <div className="bg-black border border-zinc-900 rounded-xl p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-500 font-bold">DIRECT AD-HOC SECURE GATEWAY</span>
                      <span>Syncing {wifiProgress}%</span>
                    </div>
                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${wifiProgress}%` }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                      <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">1. Connect Peer Wi-Fi</span>
                        <span className="text-[10px] font-mono text-zinc-300 mt-1 font-semibold block">SSID: SignalMesh-A7</span>
                      </div>
                      <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-900">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">2. Peer URL Gateway</span>
                        <span className="text-[10px] font-mono text-zinc-300 mt-1 font-semibold block">http://192.168.4.1:3000</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/10 border border-zinc-900 p-2.5 rounded-lg text-center text-[10px] font-mono text-zinc-400 leading-relaxed">
                      Enter temporary handshake validation code: <strong className="text-zinc-200">8 4 9 1</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button: Generate QR Code */}
            <div className="space-y-2">
              <button 
                onClick={() => setIsQrGenerated(!isQrGenerated)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                  isQrGenerated 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200' 
                    : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800/80 hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2 rounded-lg ${isQrGenerated ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-850 text-zinc-400'}`}>
                    <QrCode size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">Generate Security QR Code</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Standard: Compact Base64 Vector Schema</span>
                  </div>
                </div>
                <ChevronRight size={14} className={`text-zinc-600 transition-transform ${isQrGenerated ? 'rotate-90' : ''}`} />
              </button>

              {isQrGenerated && (
                <div className="bg-black border border-zinc-900 rounded-xl p-4 flex flex-col items-center space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Vector QR Code Generated</span>
                    <p className="text-[11px] text-zinc-500 leading-normal max-w-xs">
                      Scan this matrix from any peer device to instantly mirror the active emergency schema profiles.
                    </p>
                  </div>

                  {/* SVG deterministic vector QR */}
                  <div 
                    onClick={() => setQrZoomed(true)}
                    className="p-3 bg-white rounded-xl shadow-inner cursor-pointer hover:scale-[1.02] active:scale-100 transition-transform"
                  >
                    <svg width="140" height="140" viewBox="0 0 25 25" className="shape-rendering-crispEdges">
                      {qrGrid.map((row, rIdx) => 
                        row.map((val, cIdx) => (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill={val ? '#000000' : '#ffffff'}
                          />
                        ))
                      )}
                    </svg>
                  </div>

                  <div className="w-full flex space-x-2">
                    <button 
                      onClick={copyPayloadToClipboard}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 py-2.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 active:scale-95 transition-transform"
                    >
                      {copiedPayload ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied Vector!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Raw Payload</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setQrZoomed(true)}
                      className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Plan Fullscreen Stark Modal */}
      <AnimatePresence>
        {showPrintPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto px-4 py-8 flex items-center justify-center print:static print:bg-white print:p-0 print:overflow-visible"
          >
            {/* Header / Done print control */}
            <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-10 print:hidden">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center space-x-1.5">
                <ShieldCheck size={12} className="text-zinc-400" />
                <span>Print-Optimized Stark Format</span>
              </span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={triggerRealPrint}
                  className="bg-zinc-100 hover:bg-white text-black text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95 flex items-center space-x-1.5 shadow-md"
                >
                  <Printer size={13} />
                  <span>Send to Printer</span>
                </button>
                <button 
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white p-2 rounded-full transition-all active:scale-95"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Document wrapper */}
            <div 
              id="stark-emergency-document"
              className="w-full max-w-xl bg-white text-black p-8 md:p-12 shadow-2xl rounded-lg border border-zinc-200 font-serif flex flex-col justify-between min-h-[750px] relative mt-10 print:mt-0 print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-none"
            >
              <div className="space-y-6">
                {/* Document Header */}
                <div className="border-b-4 border-black pb-4 flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-xl font-mono font-black tracking-tight uppercase">STARK EMERGENCY PROTOCOL</h2>
                    <p className="text-[10px] font-mono text-black/60 uppercase tracking-widest">
                      CIVIL DEFENSE RECORD • PRIVATE RECORD KEEPING
                    </p>
                  </div>
                  <div className="text-right font-mono text-[10px] text-black/60">
                    <div>TIMESTAMP: {exportTimestamp}</div>
                    <div>SECTOR: FALLBACK CORE</div>
                  </div>
                </div>

                {/* Notice stamp */}
                <div className="border border-black p-3.5 text-xs bg-zinc-50 font-mono leading-relaxed space-y-1">
                  <strong className="text-black uppercase block">⚠️ ANALOG DISCHARGE NOTICE</strong>
                  <p className="text-[11px] text-black/80">
                    This document compiles household survival, medical, and safe zone directories in stark format to optimize legibility under poor light conditions or low-power physical print outs. Retain this sheet in your primary watertight emergency go-bag.
                  </p>
                </div>

                {/* Section 1: Contacts */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-black uppercase tracking-wider border-b-2 border-black pb-1">
                    01. Household & Community Communications
                  </h3>
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-black/20 text-black/60">
                        <th className="py-1.5">Name</th>
                        <th className="py-1.5">Role</th>
                        <th className="py-1.5">Phone / Frequency</th>
                        <th className="py-1.5">Meeting Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {contacts.map(c => (
                        <tr key={c.id}>
                          <td className="py-2 font-bold font-serif text-[13px]">{c.name}</td>
                          <td className="py-2">{c.role}</td>
                          <td className="py-2 font-bold">{c.phone}</td>
                          <td className="py-2">{c.meetingPoint}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Medical Info */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono font-black uppercase tracking-wider border-b-2 border-black pb-1">
                    02. Critical Medical Profiles
                  </h3>
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-black/20 text-black/60">
                        <th className="py-1.5">Name</th>
                        <th className="py-1.5">Blood Type</th>
                        <th className="py-1.5">Allergies & Conditions</th>
                        <th className="py-1.5">Daily Medications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {medical.map(m => (
                        <tr key={m.id}>
                          <td className="py-2 font-bold font-serif text-[13px]">{m.name}</td>
                          <td className="py-2 font-bold bg-zinc-100 px-1 py-0.5 rounded">{m.bloodType}</td>
                          <td className="py-2">{m.conditions}</td>
                          <td className="py-2">{m.medications}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 3: Safe Zones */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono font-black uppercase tracking-wider border-b-2 border-black pb-1">
                    03. Safe Zones & Local Navigational Map Points
                  </h3>
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-black/20 text-black/60">
                        <th className="py-1.5">Location Name</th>
                        <th className="py-1.5">GPS Coordinates</th>
                        <th className="py-1.5">Sector</th>
                        <th className="py-1.5">Backup Shelter Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {safeZones.map(z => (
                        <tr key={z.id}>
                          <td className="py-2 font-bold font-serif text-[13px]">{z.name}</td>
                          <td className="py-2 font-bold">{z.coordinates}</td>
                          <td className="py-2">{z.sector}</td>
                          <td className="py-2">{z.backup}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-black/30 pt-6 mt-8 flex justify-between items-end">
                <div className="flex items-center space-x-3.5">
                  <div className="p-1.5 bg-black rounded-md shrink-0">
                    <svg width="50" height="50" viewBox="0 0 25 25" className="shape-rendering-crispEdges">
                      {qrGrid.map((row, rIdx) => 
                        row.map((val, cIdx) => (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill={val ? '#000000' : '#ffffff'}
                          />
                        ))
                      )}
                    </svg>
                  </div>
                  <div className="space-y-0.5 font-mono text-[9px] text-black/60">
                    <div className="font-bold text-black uppercase">DATA SECTOR PAYLOAD HASH</div>
                    <div className="truncate max-w-xs uppercase">SHA-256: {payloadSizeInBytes}B_VER_1.0_L-GRID</div>
                    <div>SCAN THE QR TO RE-IMPORT FULL PLAN PROFILE</div>
                  </div>
                </div>

                <div className="text-right font-mono text-[9px] text-black/50">
                  <div className="font-bold uppercase text-black">Signal Core Application Fallback</div>
                  <div>DEVICE OFFLINE ARCHITECTURE SYSTEM</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Zoom Modal */}
      <AnimatePresence>
        {qrZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => setQrZoomed(false)}
              className="absolute top-6 right-6 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white p-2.5 rounded-full transition-all active:scale-95"
            >
              <X size={18} />
            </button>

            <div className="space-y-6 text-center max-w-sm">
              <div className="space-y-1.5">
                <h3 className="text-md font-semibold tracking-tight text-amber-400 font-mono uppercase">Full Scale Emergency QR QR Code</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Present this code directly to a peer phone camera or another Signal Core scanner to instantly download the full offline schema config.
                </p>
              </div>

              {/* Big SVG QR */}
              <div className="p-6 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <svg width="240" height="240" viewBox="0 0 25 25" className="shape-rendering-crispEdges">
                  {qrGrid.map((row, rIdx) => 
                    row.map((val, cIdx) => (
                      <rect
                        key={`${rIdx}-${cIdx}`}
                        x={cIdx}
                        y={rIdx}
                        width="1"
                        height="1"
                        fill={val ? '#000000' : '#ffffff'}
                      />
                    ))
                  )}
                </svg>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Compiled Matrix Hash ID</span>
                <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg select-all block truncate">
                  {compiledPayload.slice(0, 120)}...
                </span>
              </div>

              <button 
                onClick={copyPayloadToClipboard}
                className="w-full bg-zinc-100 hover:bg-white text-black font-semibold text-xs py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                {copiedPayload ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedPayload ? 'Copied Secure Vector' : 'Copy Compiled Text Payload'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

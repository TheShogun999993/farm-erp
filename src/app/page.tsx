// src/app/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Syringe, Fish, FileText, BarChart2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { differenceInDays, addDays, parseISO } from 'date-fns';

//==============================================================================
// 1. TYPE DEFINITIONS
//==============================================================================
interface Farm {
  id: string;
  name: string;
  species: 'Shrimp' | 'Tilapia' | 'Carp' | 'Pangasus';
  location: string;
}

interface Treatment {
  id: string;
  farmId: string;
  date: string; // ISO date string: "2025-09-15"
  product: string;
  dosage: number; // in mg
  frequency: 'Daily' | 'Once' | 'Weekly';
  reason: string;
  vetPrescriptionId?: string;
  withdrawalDays: number;
}

//==============================================================================
// 2. MOCK DATA (Simulates a database)
//==============================================================================
const MOCK_FARMS: Farm[] = [
  { id: 'farm-1', name: 'Coastal Aqua Farms', species: 'Shrimp', location: 'Andhra Pradesh' },
  { id: 'farm-2', name: 'Vembanad Fish Culture', species: 'Tilapia', location: 'Kerala' },
  { id: 'farm-3', name: 'Mahanadi Carps', species: 'Carp', location: 'Odisha' },
];

const MOCK_TREATMENTS: Treatment[] = [
    { id: 'tx-1', farmId: 'farm-1', date: '2025-09-01', product: 'Oxytetracycline 20%', dosage: 150, frequency: 'Daily', reason: 'Vibriosis', withdrawalDays: 28 },
    { id: 'tx-2', farmId: 'farm-2', date: '2025-08-20', product: 'Aquaflor 50%', dosage: 100, frequency: 'Once', reason: 'Fin Rot', withdrawalDays: 15 },
    { id: 'tx-3', farmId: 'farm-1', date: '2025-09-10', product: 'Ciprofloxacin', dosage: 120, frequency: 'Daily', reason: 'Gill Disease', withdrawalDays: 21 },
];


//==============================================================================
// 3. REUSABLE UI COMPONENTS
//==============================================================================

// KPI Card for the Dashboard
const KpiCard = ({ title, value, unit }: { title: string; value: string | number; unit?: string }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="mb-2 text-sm text-muted">{title}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-foreground">{value}</span>
      {unit && <span className="text-muted">{unit}</span>}
    </div>
  </div>
);

//==============================================================================
// 4. SECTION COMPONENTS (The different pages of the app)
//==============================================================================

// -------------------- Dashboard Section --------------------
const DashboardSection = ({ farms, treatments }: { farms: Farm[]; treatments: Treatment[] }) => {
  const now = new Date();
  const activeAlerts = treatments.filter(tx => {
    const withdrawalEndDate = addDays(parseISO(tx.date), tx.withdrawalDays);
    return now < withdrawalEndDate;
  });

  const treatmentsBySpecies = farms.reduce((acc, farm) => {
    const count = treatments.filter(tx => tx.farmId === farm.id).length;
    acc[farm.species] = (acc[farm.species] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(treatmentsBySpecies).map(([name, value]) => ({ name, treatments: value }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Farms Monitored" value={farms.length} />
        <KpiCard title="Total Treatments Logged" value={treatments.length} />
        <KpiCard title="Active Withdrawal Alerts" value={activeAlerts.length} />
        <KpiCard title="Avg. Withdrawal Period" value={treatments.length > 0 ? (treatments.reduce((sum, tx) => sum + tx.withdrawalDays, 0) / treatments.length).toFixed(1) : '0'} unit="days" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Withdrawal Period Alerts</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
            {activeAlerts.length > 0 ? (
              activeAlerts.map(tx => {
                const farm = farms.find(f => f.id === tx.farmId);
                const withdrawalEndDate = addDays(parseISO(tx.date), tx.withdrawalDays);
                const daysRemaining = differenceInDays(withdrawalEndDate, now);
                return (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                    <div className="flex items-center gap-3"><AlertTriangle className="text-warning flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{farm?.name || 'Unknown Farm'}</p>
                        <p className="text-sm text-muted">Product: {tx.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-warning">{daysRemaining} days remaining</p>
                       <p className="text-xs text-muted">until {withdrawalEndDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center gap-3 text-muted"><ShieldCheck className="text-success" /><p>No active withdrawal periods. All clear!</p></div>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
           <h2 className="mb-4 text-lg font-semibold">Treatments by Species</h2>
           <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} />
                <YAxis stroke="var(--color-muted)" fontSize={12} />
                <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} contentStyle={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }} />
                <Bar dataKey="treatments" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Record Treatment Form Section --------------------
const RecordTreatmentFormSection = ({ farms, onSave }: { farms: Farm[]; onSave: (treatment: Omit<Treatment, 'id'>) => void; }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTreatment: Omit<Treatment, 'id'> = {
      farmId: formData.get('farmId') as string,
      date: formData.get('date') as string,
      product: formData.get('product') as string,
      dosage: parseFloat(formData.get('dosage') as string),
      frequency: formData.get('frequency') as Treatment['frequency'],
      reason: formData.get('reason') as string,
      vetPrescriptionId: formData.get('vetPrescriptionId') as string,
      withdrawalDays: parseInt(formData.get('withdrawalDays') as string, 10),
    };

    if (!newTreatment.farmId) { alert('Please select a farm.'); return; }
    onSave(newTreatment);
    alert('Treatment saved successfully!');
    e.currentTarget.reset();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Record New Treatment</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Farm / Batch *</label>
            <select name="farmId" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent"><option value="">-- Select Farm --</option>{farms.map(farm => (<option key={farm.id} value={farm.id}>{farm.name} ({farm.species})</option>))}</select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Treatment Date *</label>
            <input type="date" name="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Antimicrobial Product (Brand Name) *</label>
          <input type="text" name="product" placeholder="e.g., Aquaflor 50%" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Dosage (mg) *</label>
            <input type="number" name="dosage" placeholder="e.g., 100" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">Frequency *</label>
            <select name="frequency" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent"><option>Daily</option><option>Once</option><option>Weekly</option></select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Reason for Use *</label>
          <input type="text" name="reason" placeholder="e.g., Vibriosis outbreak" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Veterinary Prescription ID (if applicable)</label>
          <input type="text" name="vetPrescriptionId" placeholder="e.g., VET-PRES-12345" className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Withdrawal Period (Days) *</label>
          <input type="number" name="withdrawalDays" placeholder="e.g., 21" required className="w-full rounded-lg border border-border bg-background p-3 focus:border-accent focus:ring-accent" />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full rounded-lg bg-accent px-6 py-3 font-bold text-background transition-colors hover:bg-accent/90">Save Treatment Log</button>
        </div>
      </form>
    </div>
  );
};

// -------------------- Placeholder for other sections --------------------
const PlaceholderSection = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-3xl font-bold">{title}</h1>
    <div className="mt-8 rounded-xl border-2 border-dashed border-border bg-card p-12 text-center text-muted">
      <p>This section is under construction.</p>
      <p className="text-sm">Functionality for {title.toLowerCase()} will be built here.</p>
    </div>
  </div>
);


//==============================================================================
// 5. MAIN APPLICATION CONTROLLER
// This is the root component for the page.
//==============================================================================
export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedFarms = localStorage.getItem('amu_farms');
    const savedTreatments = localStorage.getItem('amu_treatments');
    setFarms(savedFarms ? JSON.parse(savedFarms) : MOCK_FARMS);
    setTreatments(savedTreatments ? JSON.parse(savedTreatments) : MOCK_TREATMENTS);
  }, []);

  // Handler to save a new treatment and update state/localStorage
  const handleSaveTreatment = (newTreatmentData: Omit<Treatment, 'id'>) => {
    const newTreatment: Treatment = { id: `tx-${Date.now()}`, ...newTreatmentData };
    const updatedTreatments = [...treatments, newTreatment];
    setTreatments(updatedTreatments);
    localStorage.setItem('amu_treatments', JSON.stringify(updatedTreatments));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardSection farms={farms} treatments={treatments} />;
      case 'recordTreatment': return <RecordTreatmentFormSection farms={farms} onSave={handleSaveTreatment} />;
      case 'farms': return <PlaceholderSection title="Farms Management" />;
      case 'prescriptions': return <PlaceholderSection title="Prescriptions" />;
      case 'analytics': return <PlaceholderSection title="Analytics & Trends" />;
      default: return <DashboardSection farms={farms} treatments={treatments} />;
    }
  };

  // --- Sidebar Navigation Definition ---
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farms', label: 'Farms', icon: Fish },
    { id: 'recordTreatment', label: 'Record Treatment', icon: Syringe },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-background/50 p-4">
        <div className="mb-8 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-accent"></div><h1 className="text-xl font-bold">AMU Platform</h1></div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${activeView === item.id ? 'bg-accent/20 text-accent' : 'text-muted hover:bg-card hover:text-foreground'}`}>
              <item.icon size={20} /><span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

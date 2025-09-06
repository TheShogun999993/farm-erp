// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMU Monitoring - Prototype",
  description: "UI and data-capture template for an AMU monitoring system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground bg-[linear-gradient(180deg,#071026_0%,#061428_100%)]`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// Reusable Header Component
const Header = () => (
  <header className="flex items-center justify-between border-b border-white/5 px-5 py-4">
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="5" fill="#00a3ff" />
        <path d="M6 12c1.333-2 4-4 6-4s4.667 2 6 4c-1.333 2-4 4-6 4s-4.667-2-6-4z" fill="white" opacity="0.95" />
      </svg>
      <h1 className="text-lg font-semibold">AMU Monitoring — Prototype</h1>
      <div className="ml-2 text-sm text-muted">India — Aquaculture module</div>
    </div>
    <div className="text-sm text-muted">Offline-ready • Data stored locally</div>
  </header>
);

// Reusable Footer Component
const Footer = () => (
  <footer className="p-5 text-center text-sm text-muted">
    Prototype — not for production. Use this as a UI + data-capture template for an AMU monitoring system.
  </footer>
);```

### 3. Main Application Page (`src/app/page.tsx`)

This is the fully updated page component with all Chart.js imports, registrations, and the `AmuChart` component completely removed. The `Dashboard` component has also been simplified.

```tsx
// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
interface Farm {
  id: string;
  name: string;
  owner: string;
  species: 'shrimp' | 'tilapia' | 'carp' | 'pangasius';
  number: number;
}
interface Treatment {
  id: string;
  farmId: string;
  date: string;
  product: string;
  dose: number;
  route: 'feed' | 'bath' | 'injection';
  duration: number;
  indication: string;
}

// --- MAIN PAGE COMPONENT ---
export default function AmuMonitoringPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [lastSync, setLastSync] = useState('never');

  useEffect(() => {
    const loadedFarms = JSON.parse(localStorage.getItem('amu.farms') || '[]') as Farm[];
    const loadedTxs = JSON.parse(localStorage.getItem('amu.txs') || '[]') as Treatment[];
    setFarms(loadedFarms);
    setTreatments(loadedTxs);
    if (loadedFarms.length > 0 || loadedTxs.length > 0) {
      setLastSync(new Date().toLocaleString());
    }
  }, []);

  const saveData = (newFarms: Farm[], newTxs: Treatment[]) => {
    localStorage.setItem('amu.farms', JSON.stringify(newFarms));
    localStorage.setItem('amu.txs', JSON.stringify(newTxs));
    setLastSync(new Date().toLocaleString());
  };

  const handleAddFarm = (farm: Farm) => {
    const newFarms = [...farms, farm];
    setFarms(newFarms);
    saveData(newFarms, treatments);
    alert('Farm saved!');
  };

  const handleAddTreatment = (tx: Treatment) => {
    const newTxs = [...treatments, tx];
    setTreatments(newTxs);
    saveData(farms, newTxs);
    alert('Treatment recorded!');
  };

  return (
    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[320px_1fr]">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <div className="min-h-[70vh]">
        {activeView === 'dashboard' && <Dashboard farms={farms} treatments={treatments} lastSync={lastSync} />}
        {activeView === 'farm' && <FarmForm onAddFarm={handleAddFarm} />}
        {activeView === 'treatment' && <TreatmentForm farms={farms} onAddTreatment={handleAddTreatment} />}
        {activeView === 'prescription' && <Placeholder title="Prescription" />}
        {activeView === 'lab' && <Placeholder title="Lab Result" />}
        {activeView === 'withdrawal' && <WithdrawalCalculator />}
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-xl border border-border-subtle bg-[linear-gradient(180deg,var(--bg-subtle-2),var(--bg-subtle-3))] p-4 ${className}`}
  >
    {children}
  </div>
);
const Button = ({ children, onClick, variant = 'primary', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; type?: 'button' | 'submit' }) => {
    const styles = {
        primary: 'bg-accent text-[#052033] hover:bg-accent/90',
        secondary: 'bg-[#253244] text-white hover:bg-[#253244]/90',
    };
    return <button type={type} onClick={onClick} className={`rounded-lg px-4 py-2.5 font-semibold transition-colors ${styles[variant]}`}>{children}</button>
}
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full rounded-lg border border-border-subtle bg-transparent p-2.5 text-foreground placeholder:text-muted/50" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full rounded-lg border border-border-subtle bg-transparent p-2.5 text-foreground" />
);
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="mb-1.5 block text-sm text-muted">{label}</label>
        {children}
    </div>
);

// --- NAVIGATION COMPONENT ---
const Navigation = ({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void }) => {
  const navItems = ['dashboard', 'farm', 'treatment', 'prescription', 'lab', 'withdrawal'];
  return (
    <nav className="h-fit rounded-xl bg-[linear-gradient(180deg,var(--bg-subtle-2),transparent)] p-4">
      <div className="mb-4">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            onClick={(e) => { e.preventDefault(); setActiveView(item); }}
            className={`mb-1.5 block rounded-lg px-3 py-2.5 text-muted transition-colors hover:text-white ${activeView === item ? 'bg-bg-subtle-1 text-white' : ''}`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
          </a>
        ))}
      </div>
      <div>
        <div className="text-sm text-muted">Quick Actions</div>
        <Button onClick={() => alert('Add Farm form is available in the menu.')} variant='primary'>Add sample farm</Button>
      </div>
    </nav>
  );
};

// --- SECTION COMPONENTS ---
const Dashboard = ({ farms, treatments, lastSync }: { farms: Farm[], treatments: Treatment[], lastSync: string }) => {
    const totalTx = treatments.length;
    const avgMg = totalTx > 0 ? (treatments.reduce((sum, tx) => sum + (tx.dose || 0), 0) / totalTx).toFixed(2) : '0';
    return (
        <Card>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <div className="text-sm text-muted">Last sync: {lastSync}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Total farms</div>
                        <div className="text-xl font-bold">{farms.length}</div>
                    </div>
                    <div className="text-sm">Total treatments recorded: {totalTx}</div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Avg mg active / kg biomass</div>
                        <div className="text-xl font-bold">{avgMg}</div>
                    </div>
                </Card>
            </div>
        </Card>
    );
};
const FarmForm = ({ onAddFarm }: { onAddFarm: (farm: Farm) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newFarm: Farm = { id: `farm-${Date.now()}`, name: formData.get('farm-name') as string, owner: formData.get('farm-owner') as string, species: formData.get('farm-species') as Farm['species'], number: parseInt(formData.get('farm-number') as string, 10), };
        onAddFarm(newFarm);
        e.currentTarget.reset();
    };
    return (
        <Card>
            <h2 className="text-lg font-semibold">Register farm / batch</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Farm name"><Input name="farm-name" placeholder="Example: Sundar Aquaculture" required /></FormField><FormField label="Owner / contact"><Input name="farm-owner" placeholder="Phone / name" /></FormField></div>
                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                    <FormField label="Species"><Select name="farm-species"><option value="shrimp">Shrimp</option><option value="tilapia">Tilapia</option><option value="carp">Carp</option><option value="pangasius">Pangasius</option></Select></FormField>
                    <FormField label="Number stocked"><Input name="farm-number" type="number" min="1" defaultValue="1000" required /></FormField>
                </div>
                <div className="flex gap-2 pt-2"><Button type="submit">Save farm</Button><Button variant="secondary" onClick={() => alert('Cancelled')}>Cancel</Button></div>
            </form>
        </Card>
    );
};
const TreatmentForm = ({ farms, onAddTreatment }: { farms: Farm[], onAddTreatment: (tx: Treatment) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTx: Treatment = { id: `tx-${Date.now()}`, farmId: formData.get('tx-farm') as string, date: formData.get('tx-date') as string || new Date().toISOString().slice(0, 10), product: formData.get('tx-product') as string, dose: parseFloat(formData.get('tx-dose') as string), route: formData.get('tx-route') as Treatment['route'], duration: parseInt(formData.get('tx-duration') as string, 10), indication: formData.get('tx-indication') as string, };
        onAddTreatment(newTx);
        e.currentTarget.reset();
    };
    return (
        <Card>
            <h2 className="text-lg font-semibold">Record treatment</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Select farm / batch"><Select name="tx-farm" required>{farms.map(f => <option key={f.id} value={f.id}>{f.name} — {f.species}</option>)}</Select></FormField><FormField label="Treatment date"><Input name="tx-date" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></FormField></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Product (brand)"><Input name="tx-product" placeholder="e.g., Oxytetracycline 10%" required /></FormField><FormField label="Active ingredient (mg/kg)"><Input name="tx-dose" type="number" step="0.1" placeholder="mg/kg" required /></FormField></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Route"><Select name="tx-route"><option value="feed">Feed</option><option value="bath">Bath/Water</option><option value="injection">Injection</option></Select></FormField><FormField label="Duration (days)"><Input name="tx-duration" type="number" min="1" defaultValue="3" required /></FormField></div>
                <FormField label="Indication / reason"><Input name="tx-indication" placeholder="e.g., bacterial gill disease" /></FormField>
                <div className="flex gap-2 pt-2"><Button type="submit">Save treatment</Button></div>
            </form>
        </Card>
    );
}
const WithdrawalCalculator = () => {
    const [result, setResult] = useState('-');
    const compute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const endDate = formData.get('wd-end') as string;
        const days = parseInt(formData.get('wd-days') as string || '0', 10);
        if (!endDate) { alert('Please enter a treatment end date.'); return; }
        const d = new Date(endDate);
        d.setDate(d.getDate() + days);
        setResult(d.toISOString().slice(0, 10));
    };
    return (
        <Card>
            <h2 className="text-lg font-semibold">Withdrawal calculator</h2>
            <p className="mt-1 text-sm text-muted">Enter treatment end date and withdrawal days to compute clearance date.</p>
            <form onSubmit={compute} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Treatment end"><Input name="wd-end" type="date" required /></FormField>
                    <FormField label="Withdrawal (days)"><Input name="wd-days" type="number" min="0" defaultValue="21" /></FormField>
                </div>
                <div className="flex items-center gap-4 pt-2">
                    <Button type="submit">Compute clearance</Button>
                    <div className="text-sm text-muted">Clearance date: <span className="font-semibold text-white">{result}</span></div>
                </div>
            </form>
        </Card>
    );
};
const Placeholder = ({ title }: { title: string }) => (
    <Card><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-muted">This component is a placeholder.</p></Card>
);

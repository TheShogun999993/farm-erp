// src/app/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the components Chart.js needs to draw a bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- TYPE DEFINITIONS ---
interface Farm {
  id: string;
  name: string;
  owner: string;
  species: 'shrimp' | 'tilapia' | 'carp' | 'pangasius';
  number: number;
  created: string;
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
interface Prescription {
  id: string;
  vet: string;
  reg: string;
  txId: string;
  issued: string;
}
interface LabResult {
  id: string;
  sample: string;
  value: number;
  txId: string;
  reported: string;
}

// --- MAIN PAGE COMPONENT ---
export default function AmuMonitoringPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [lastSync, setLastSync] = useState('never');

  // Load data from localStorage on initial render
  useEffect(() => {
    setFarms(JSON.parse(localStorage.getItem('amu.farms') || '[]'));
    setTreatments(JSON.parse(localStorage.getItem('amu.txs') || '[]'));
    setPrescriptions(JSON.parse(localStorage.getItem('amu.prescs') || '[]'));
    setLabResults(JSON.parse(localStorage.getItem('amu.labs') || '[]'));
    if (localStorage.getItem('amu.farms')) {
      setLastSync(new Date().toLocaleString());
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('amu.farms', JSON.stringify(farms));
    localStorage.setItem('amu.txs', JSON.stringify(treatments));
    localStorage.setItem('amu.prescs', JSON.stringify(prescriptions));
    localStorage.setItem('amu.labs', JSON.stringify(labResults));
    if (farms.length > 0 || treatments.length > 0) {
      setLastSync(new Date().toLocaleString());
    }
  }, [farms, treatments, prescriptions, labResults]);


  const handleAddFarm = (farm: Farm) => {
    setFarms(prev => [...prev, farm]);
    alert('Farm saved!');
  };

  const handleAddTreatment = (tx: Treatment) => {
    setTreatments(prev => [...prev, tx]);
    alert('Treatment recorded!');
  };
  
  const handleAddPrescription = (p: Prescription) => {
    setPrescriptions(prev => [...prev, p]);
    alert('Prescription saved!');
  };

  const handleAddLabResult = (lab: LabResult) => {
    setLabResults(prev => [...prev, lab]);
    alert('Lab result stored!');
  };

  return (
    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[320px_1fr]">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <div className="min-h-[70vh]">
        {activeView === 'dashboard' && <Dashboard farms={farms} treatments={treatments} lastSync={lastSync} />}
        {activeView === 'farm' && <FarmForm onSave={handleAddFarm} />}
        {activeView === 'treatment' && <TreatmentForm farms={farms} onSave={handleAddTreatment} />}
        {activeView === 'prescription' && <PrescriptionForm treatments={treatments} onSave={handleAddPrescription} />}
        {activeView === 'lab' && <LabForm treatments={treatments} onSave={handleAddLabResult} />}
        {activeView === 'withdrawal' && <WithdrawalCalculator />}
      </div>
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-border-subtle bg-[linear-gradient(180deg,var(--bg-subtle-2),var(--bg-subtle-3))] p-4 ${className}`}>
    {children}
  </div>
);
const Button = ({ children, onClick, variant = 'primary', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'success'; type?: 'button' | 'submit' }) => {
    const styles = {
        primary: 'bg-accent text-[#052033] hover:bg-accent/90',
        secondary: 'bg-[#253244] text-white hover:bg-[#253244]/90',
        success: 'bg-[#2d6a4f] text-white hover:bg-[#2d6a4f]/90',
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
            {item.charAt(0).toUpperCase() + item.slice(1).replace(' Calc', ' Calculator')}
          </a>
        ))}
      </div>
    </nav>
  );
};


// --- FORM & SECTION COMPONENTS ---
const Dashboard = ({ farms, treatments, lastSync }: { farms: Farm[], treatments: Treatment[], lastSync: string }) => {
    const totalTx = treatments.length;
    const avgMg = totalTx > 0 ? (treatments.reduce((sum, tx) => sum + (tx.dose || 0), 0) / totalTx).toFixed(2) : '0';
    const recentTreatments = [...treatments].reverse().slice(0, 5);

    return (
        <Card className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <div className="text-sm text-muted">Last sync: {lastSync}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between"><div className="text-sm">Total farms</div><div className="text-xl font-bold">{farms.length}</div></div>
                    <div className="text-sm">Total treatments recorded: {totalTx}</div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between"><div className="text-sm">Avg mg active / kg biomass</div><div className="text-xl font-bold">{avgMg}</div></div>
                </Card>
            </div>
            <Card>
                <h3 className="mb-2.5 font-semibold">AMU by drug class (sample)</h3>
                <div className="h-[120px]"><AmuChart treatments={treatments} /></div>
            </Card>
            <Card>
                <h3 className="mb-2.5 font-semibold">Recent Treatments</h3>
                {recentTreatments.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {recentTreatments.map(tx => (
                            <li key={tx.id}>
                                <span className="font-semibold text-white">{(farms.find(f => f.id === tx.farmId)?.name) || 'Unknown Farm'}:</span>
                                <span className="text-muted"> {tx.product} on {tx.date}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-sm text-muted">No data yet</div>
                )}
            </Card>
        </Card>
    );
};

const FarmForm = ({ onSave }: { onSave: (farm: Farm) => void }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newFarm: Farm = {
            id: `farm-${Date.now()}`,
            name: formData.get('farm-name') as string,
            owner: formData.get('farm-owner') as string,
            species: formData.get('farm-species') as Farm['species'],
            number: parseInt(formData.get('farm-number') as string, 10),
            created: new Date().toISOString(),
        };
        onSave(newFarm);
        e.currentTarget.reset();
    };
    return (
        <Card>
            <h2 className="text-lg font-semibold">Register farm / batch</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Farm name"><Input name="farm-name" placeholder="Example: Sundar Aquaculture" required /></FormField>
                    <FormField label="Owner / contact"><Input name="farm-owner" placeholder="Phone / name" /></FormField>
                </div>
                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]">
                    <FormField label="Species">
                        <Select name="farm-species" defaultValue="shrimp"><option value="shrimp">Shrimp</option><option value="tilapia">Tilapia</option><option value="carp">Carp</option><option value="pangasius">Pangasius</option></Select>
                    </FormField>
                    <FormField label="Number stocked"><Input name="farm-number" type="number" min="1" defaultValue="1000" required /></FormField>
                </div>
                <div className="flex gap-2 pt-2"><Button type="submit">Save farm</Button><Button variant="secondary">Cancel</Button></div>
            </form>
        </Card>
    );
};

const TreatmentForm = ({ farms, onSave }: { farms: Farm[], onSave: (tx: Treatment) => void }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTx: Treatment = {
            id: `tx-${Date.now()}`,
            farmId: formData.get('tx-farm') as string,
            date: formData.get('tx-date') as string || new Date().toISOString().slice(0, 10),
            product: formData.get('tx-product') as string,
            dose: parseFloat(formData.get('tx-dose') as string),
            route: formData.get('tx-route') as Treatment['route'],
            duration: parseInt(formData.get('tx-duration') as string, 10),
            indication: formData.get('tx-indication') as string,
        };
        if (!newTx.farmId) { alert("Please select a farm."); return; }
        onSave(newTx);
        e.currentTarget.reset();
    };
    return (
        <Card>
            <h2 className="text-lg font-semibold">Record treatment</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Select farm / batch"><Select name="tx-farm" required><option value="">-- Select a Farm --</option>{farms.map(f => <option key={f.id} value={f.id}>{f.name} — {f.species}</option>)}</Select></FormField>
                    <FormField label="Treatment date"><Input name="tx-date" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></FormField>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Product (brand)"><Input name="tx-product" placeholder="e.g., Oxytetracycline 10%" required /></FormField><FormField label="Active ingredient (mg/kg)"><Input name="tx-dose" type="number" step="0.1" placeholder="mg/kg" required /></FormField></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FormField label="Route"><Select name="tx-route" defaultValue="feed"><option value="feed">Feed</option><option value="bath">Bath/Water</option><option value="injection">Injection</option></Select></FormField><FormField label="Duration (days)"><Input name="tx-duration" type="number" min="1" defaultValue="3" required /></FormField></div>
                <FormField label="Indication / reason"><Input name="tx-indication" placeholder="e.g., bacterial gill disease" /></FormField>
                <div className="flex gap-2 pt-2"><Button type="submit">Save treatment</Button><Button variant="success">Check withdrawal</Button></div>
            </form>
        </Card>
    );
}

const PrescriptionForm = ({ treatments, onSave }: { treatments: Treatment[], onSave: (p: Prescription) => void }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPrescription: Prescription = {
            id: `presc-${Date.now()}`,
            vet: formData.get('vet-name') as string,
            reg: formData.get('vet-reg') as string,
            txId: formData.get('presc-tx') as string,
            issued: new Date().toISOString(),
        };
        onSave(newPrescription);
        e.currentTarget.reset();
    }
    return (
        <Card>
            <h2 className="text-lg font-semibold">Vet Prescription (simple)</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Vet name"><Input name="vet-name" placeholder="Dr. Lal" /></FormField>
                    <FormField label="Registration no."><Input name="vet-reg" placeholder="REG-12345" /></FormField>
                </div>
                <FormField label="Attach to treatment"><Select name="presc-tx">{treatments.map(t => <option key={t.id} value={t.id}>{t.product} @ {t.date}</option>)}</Select></FormField>
                <div className="flex gap-2 pt-2"><Button type="submit">Save prescription</Button></div>
            </form>
        </Card>
    )
}

const LabForm = ({ treatments, onSave }: { treatments: Treatment[], onSave: (lab: LabResult) => void }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newLabResult: LabResult = {
            id: `lab-${Date.now()}`,
            sample: formData.get('lab-sample') as string,
            value: parseFloat(formData.get('lab-value') as string),
            txId: formData.get('lab-tx') as string,
            reported: new Date().toISOString(),
        };
        onSave(newLabResult);
        e.currentTarget.reset();
    }
    return (
        <Card>
            <h2 className="text-lg font-semibold">Upload lab result</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Sample ID"><Input name="lab-sample" placeholder="SAMPLE-001" /></FormField>
                    <FormField label="Analyze (mg/kg)"><Input name="lab-value" type="number" step="0.001" placeholder="e.g., 0.05" /></FormField>
                </div>
                <FormField label="Related treatment"><Select name="lab-tx">{treatments.map(t => <option key={t.id} value={t.id}>{t.product} @ {t.date}</option>)}</Select></FormField>
                <div className="flex gap-2 pt-2"><Button type="submit">Save result</Button></div>
            </form>
        </Card>
    );
};

const WithdrawalCalculator = () => {
    const [result, setResult] = useState('-');
    const compute = (e: FormEvent<HTMLFormElement>) => {
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

// --- CHART COMPONENT ---
const AmuChart = ({ treatments }: { treatments: Treatment[] }) => {
  const options = {
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
    scales: { y: { ticks: { color: '#9aa4b2' } }, x: { ticks: { color: '#9aa4b2' } } },
  };
  const productGroups = treatments.reduce((acc, tx) => {
    const key = tx.product || 'Unknown';
    acc[key] = (acc[key] || 0) + (tx.dose || 0);
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(productGroups),
    datasets: [{
        label: 'Total Dose (mg)',
        data: Object.values(productGroups),
        backgroundColor: 'rgba(0, 163, 255, 0.7)',
    }],
  };
  return <Bar options={options} data={data} />;
};

// src/app/page.tsx
'use client'; // This directive makes the component a Client Component

import React, { useState } from 'react';

// A reusable component for form fields to reduce code duplication
const FormField = ({ label, name, required = false, children }: { label: string, name: string, required?: boolean, children: React.ReactNode }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-1">
      {children}
    </div>
  </div>
);

// The main page component
export default function FisheriesMonitoringPage() {
  const [formData, setFormData] = useState({
    sample_id: '',
    farm_name: '',
    address: '',
    state: '',
    district: '',
    block: '',
    village: '',
    visit_date: '',
    study_period: '',
    interview_person: '',
    role: 'Fisheries Officer',
    contact: '',
    email: '',
    latitude: '',
    longitude: '',
    farm_id: '',
    farm_type: 'Pond-based',
    water_source: 'River / Canal',
    culture_type: 'Inland Freshwater',
    species: '',
    area: '',
    stocking_density: '',
    stocking_date: '',
    stock_stage: 'Hatchery stage',
    avg_weight: '',
    biomass: '',
    consultation: 'Yes',
    mortality_rate: '',
    stocked: '',
    alive: '',
    died: '',
    harvested: '',
    restocked: '',
    feed: '',
    water_exchange: '',
    vaccination: 'Yes',
    antibiotics: 'No',
    antibiotic_details: '',
    other_chemicals: '',
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted Data:", formData);
    // Here you would typically send the data to a server or API endpoint
    alert('Form data has been logged to the console. Press F12 to view.');
  };

  // Helper styles for form elements
  const inputStyles = "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";

  return (
    <main className="bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Fisheries AMU Monitoring Tool
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          
          {/* General Information Section */}
          <section className="rounded-lg border border-gray-200 bg-slate-50/50 p-6">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">General Information</h3>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <FormField label="Sample ID" name="sample_id" required>
                <input type="number" name="sample_id" id="sample_id" value={formData.sample_id} onChange={handleChange} required className={inputStyles} />
              </FormField>
              <FormField label="Farm Name" name="farm_name" required>
                <input type="text" name="farm_name" id="farm_name" value={formData.farm_name} onChange={handleChange} required className={inputStyles} />
              </FormField>
              {/* Add all other fields from the "General Information" section here following the pattern */}
              <FormField label="Short Address (Panchayath)" name="address" required>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className={inputStyles} />
              </FormField>
              <FormField label="State" name="state" required>
                <select id="state" name="state" value={formData.state} onChange={handleChange} required className={inputStyles}>
                  <option value="">Select State</option>
                  <option>Andhra Pradesh</option> <option>Kerala</option> <option>Tamil Nadu</option>
                  <option>Odisha</option> <option>West Bengal</option> <option>Other</option>
                </select>
              </FormField>
              <FormField label="District" name="district" required><input type="text" name="district" id="district" value={formData.district} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="Block/Taluk" name="block" required><input type="text" name="block" id="block" value={formData.block} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="Village" name="village" required><input type="text" name="village" id="village" value={formData.village} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="Date of Visit" name="visit_date"><input type="date" name="visit_date" id="visit_date" value={formData.visit_date} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Name of Person for Interview" name="interview_person" required><input type="text" name="interview_person" id="interview_person" value={formData.interview_person} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="Role" name="role"><select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyles}><option>Fisheries Officer</option><option>Farmer</option><option>Farm Owner</option></select></FormField>
              <FormField label="Contact No" name="contact"><input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Email ID" name="email"><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Latitude" name="latitude"><input type="text" name="latitude" id="latitude" value={formData.latitude} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Longitude" name="longitude"><input type="text" name="longitude" id="longitude" value={formData.longitude} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Farm Number (ID)" name="farm_id" required><input type="text" name="farm_id" id="farm_id" value={formData.farm_id} onChange={handleChange} required className={inputStyles} /></FormField>
            </div>
          </section>

          {/* Farm & Fish Details Section */}
          <section className="rounded-lg border border-gray-200 bg-slate-50/50 p-6">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">Farm & Fish Details</h3>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <FormField label="Farm Type" name="farm_type" required><select id="farm_type" name="farm_type" value={formData.farm_type} onChange={handleChange} required className={inputStyles}><option>Pond-based</option><option>Cage culture</option><option>Tank / RAS</option><option>Pen culture</option><option>Other</option></select></FormField>
              <FormField label="Water Source" name="water_source" required><select id="water_source" name="water_source" value={formData.water_source} onChange={handleChange} required className={inputStyles}><option>River / Canal</option><option>Reservoir / Lake</option><option>Groundwater</option><option>Seawater</option><option>Mixed</option></select></FormField>
              <FormField label="Culture Type" name="culture_type" required><select id="culture_type" name="culture_type" value={formData.culture_type} onChange={handleChange} required className={inputStyles}><option>Inland Freshwater</option><option>Brackishwater</option><option>Marine</option></select></FormField>
              <FormField label="Species Cultured" name="species" required><input type="text" name="species" id="species" value={formData.species} onChange={handleChange} placeholder="e.g. Rohu, Catla, Tilapia" required className={inputStyles} /></FormField>
              <FormField label="Total Area under Culture" name="area"><input type="text" name="area" id="area" value={formData.area} onChange={handleChange} placeholder="ha / m² / cages" className={inputStyles} /></FormField>
              <FormField label="Stocking Density" name="stocking_density"><input type="text" name="stocking_density" id="stocking_density" value={formData.stocking_density} onChange={handleChange} placeholder="no. per ha/m²/cage" className={inputStyles} /></FormField>
              <FormField label="Date of Stocking" name="stocking_date"><input type="date" name="stocking_date" id="stocking_date" value={formData.stocking_date} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Current Stage of Stock" name="stock_stage"><select id="stock_stage" name="stock_stage" value={formData.stock_stage} onChange={handleChange} className={inputStyles}><option>Hatchery stage</option><option>Nursery stage</option><option>Grow-out</option><option>Broodstock</option></select></FormField>
              <FormField label="Average Body Weight (g/kg)" name="avg_weight"><input type="text" name="avg_weight" id="avg_weight" value={formData.avg_weight} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Total Standing Biomass (kg)" name="biomass"><input type="text" name="biomass" id="biomass" value={formData.biomass} onChange={handleChange} className={inputStyles} /></FormField>
            </div>
          </section>

          {/* Health & Management Section */}
          <section className="rounded-lg border border-gray-200 bg-slate-50/50 p-6">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">Health & Management</h3>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <FormField label="No. of Fish Stocked Initially" name="stocked" required><input type="number" name="stocked" id="stocked" value={formData.stocked} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="No. of Fish Currently Alive" name="alive" required><input type="number" name="alive" id="alive" value={formData.alive} onChange={handleChange} required className={inputStyles} /></FormField>
              <FormField label="No. of Fish Died" name="died"><input type="number" name="died" id="died" value={formData.died} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="No. of Fish Harvested / Sold" name="harvested"><input type="number" name="harvested" id="harvested" value={formData.harvested} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Mortality Rate (%)" name="mortality_rate"><input type="text" name="mortality_rate" id="mortality_rate" value={formData.mortality_rate} onChange={handleChange} className={inputStyles} /></FormField>
              <FormField label="Vaccination / Prophylaxis" name="vaccination"><select id="vaccination" name="vaccination" value={formData.vaccination} onChange={handleChange} className={inputStyles}><option>Yes</option><option>No</option><option>Don't Know</option></select></FormField>
            </div>
          </section>

          {/* AMU Section */}
          <section className="rounded-lg border border-gray-200 bg-slate-50/50 p-6">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">Antimicrobial Use (AMU)</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-4">
              <FormField label="Antibiotics Used" name="antibiotics" required>
                <select id="antibiotics" name="antibiotics" value={formData.antibiotics} onChange={handleChange} required className={inputStyles}>
                  <option>No</option><option>Yes</option><option>Don't Know</option>
                </select>
              </FormField>
              <FormField label="If Yes, specify details" name="antibiotic_details">
                <textarea id="antibiotic_details" name="antibiotic_details" value={formData.antibiotic_details} onChange={handleChange} rows={4} placeholder="Name, Dosage, Purpose, Duration" className={inputStyles}></textarea>
              </FormField>
              <FormField label="Other Chemicals / Probiotics / Additives Used" name="other_chemicals">
                <textarea id="other_chemicals" name="other_chemicals" value={formData.other_chemicals} onChange={handleChange} rows={3} className={inputStyles}></textarea>
              </FormField>
              <FormField label="Remarks" name="remarks">
                <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className={inputStyles}></textarea>
              </FormField>
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

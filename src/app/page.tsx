import React, { useState } from "react";

interface FormData {
  sample_id: string;
  farm_name: string;
  address: string;
  state: string;
  district: string;
  block: string;
  village: string;
  visit_date: string;
  study_period: string;
  interview_person: string;
  role: string;
  contact: string;
  email: string;
  latitude: string;
  longitude: string;
  farm_id: string;
  farm_type: string;
  water_source: string;
  culture_type: string;
  species: string;
  area: string;
  stocking_density: string;
  stocking_date: string;
  stock_stage: string;
  avg_weight: string;
  biomass: string;
  consultation: string;
  mortality_rate: string;
  stocked: string;
  alive: string;
  died: string;
  harvested: string;
  restocked: string;
  feed: string;
  water_exchange: string;
  vaccination: string;
  antibiotics: string;
  antibiotic_details: string;
  other_chemicals: string;
  remarks: string;
}

const FisheriesAMUForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    sample_id: "",
    farm_name: "",
    address: "",
    state: "",
    district: "",
    block: "",
    village: "",
    visit_date: "",
    study_period: "",
    interview_person: "",
    role: "Fisheries Officer",
    contact: "",
    email: "",
    latitude: "",
    longitude: "",
    farm_id: "",
    farm_type: "Pond-based",
    water_source: "River / Canal",
    culture_type: "Inland Freshwater",
    species: "",
    area: "",
    stocking_density: "",
    stocking_date: "",
    stock_stage: "Hatchery stage",
    avg_weight: "",
    biomass: "",
    consultation: "Yes",
    mortality_rate: "",
    stocked: "",
    alive: "",
    died: "",
    harvested: "",
    restocked: "",
    feed: "",
    water_exchange: "",
    vaccination: "No",
    antibiotics: "No",
    antibiotic_details: "",
    other_chemicals: "",
    remarks: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        Fisheries AMU Monitoring Tool
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Example Fields */}
        <div>
          <label className="font-semibold">Sample ID *</label>
          <input
            type="number"
            name="sample_id"
            value={formData.sample_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Farm Name *</label>
          <input
            type="text"
            name="farm_name"
            value={formData.farm_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select State</option>
            <option>Andhra Pradesh</option>
            <option>Kerala</option>
            <option>Tamil Nadu</option>
            <option>Odisha</option>
            <option>West Bengal</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Species Cultured *</label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            placeholder="e.g. Rohu, Catla, Tilapia, Shrimp"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Antibiotics Used *</label>
          <select
            name="antibiotics"
            value={formData.antibiotics}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Yes</option>
            <option>No</option>
            <option>Don't Know</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FisheriesAMUForm;

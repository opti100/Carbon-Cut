import { OrganizationData } from "@/types/types";

interface OrganizationFormProps {
  organization: OrganizationData;
  onOrganizationChange: (organization: OrganizationData) => void;
}

export default function OrganizationForm({ organization, onOrganizationChange }: OrganizationFormProps) {
  const handleChange = (field: keyof OrganizationData, value: string) => {
    onOrganizationChange({
      ...organization,
      [field]: value
    });
  };

  return (
    <section className="mb-8 p-6 bg-black rounded-lg">
      {/* <h2 className="text-2xl font-semibold mb-4">Organization & Reporting Details</h2>
      <p className="text-gray-400 mb-6">
        We report <strong>gross emissions</strong> and disclose offsets separately (per GHG Protocol / SBTi). 
        This tool uses latest 2025 emission factors and updated grid intensities.
      </p> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Organization / Brand</label>
          <input
            type="text"
            value={organization.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Acme Corp"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Reporting period</label>
          <input
            type="text"
            value={organization.period}
            onChange={(e) => handleChange('period', e.target.value)}
            placeholder="FY2025"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Offsets to disclose separately (kg CO₂e)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter your offset amount"
            value={organization.offsets}
            onChange={(e) => handleChange('offsets', e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </section>
  );
}
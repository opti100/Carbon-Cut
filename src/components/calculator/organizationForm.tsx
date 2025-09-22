import { OrganizationData } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrganizationFormProps {
  organization: OrganizationData;
  onOrganizationChange: (organization: OrganizationData) => void;
}

export default function OrganizationForm({ organization, onOrganizationChange }: OrganizationFormProps) {
  const handleChange = (field: keyof OrganizationData, value: string) => {
    onOrganizationChange({
      ...organization,
      [field]: value,
    });
  };

  return (
    <div className="bg-white px-6 py-8 space-y-6 ">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          Organization & Reporting Details
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          We report <strong className="text-orange-400">gross emissions</strong> and disclose offsets separately (per GHG Protocol / SBTi). 
          This tool uses latest 2025 emission factors and updated grid intensities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="org-name" className="text-gray-700 font-medium">Organization / Brand</Label>
          <Input
            id="org-name"
            type="text"
            value={organization.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Acme Corp"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reporting-period" className="text-gray-700 font-medium">Reporting period</Label>
          <Input
            id="reporting-period"
            type="text"
            value={organization.period}
            onChange={(e) => handleChange("period", e.target.value)}
            placeholder="FY2025"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offsets" className="text-gray-700 font-medium">
            Offsets to disclose separately (kg CO₂e)
          </Label>
          <Input
            id="offsets"
            type="number"
            step="0.01"
            placeholder="Enter your offset amount"
            value={organization.offsets}
            onChange={(e) => handleChange("offsets", e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>
    </div>
  );
}

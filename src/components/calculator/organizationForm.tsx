import { OrganizationData } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      [field]: value
    });
  };

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-2xl text-gray-900 font-semibold">Organization & Reporting Details</CardTitle>
        <p className="text-gray-600 mt-2">
          We report <strong>gross emissions</strong> and disclose offsets separately (per GHG Protocol / SBTi). 
          This tool uses latest 2025 emission factors and updated grid intensities.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-gray-700 font-medium">Organization / Brand</Label>
            <Input
              id="org-name"
              type="text"
              value={organization.name}
              onChange={(e) => handleChange('name', e.target.value)}
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
              onChange={(e) => handleChange('period', e.target.value)}
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
              onChange={(e) => handleChange('offsets', e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
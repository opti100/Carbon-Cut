import { ActivityData, OrganizationData } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { CheckCircle, Leaf, Building2, Download, Loader2, Award, CreditCard } from "lucide-react";
import { PDFFormData } from "@/services/report-formats/secr-report";
import { generateCarbonEmissionsReport } from "@/services/report-formats";

interface ReportActionsProps {
  organization: OrganizationData;
  activities: ActivityData[];
  getDisplayCO2: (activity: ActivityData) => number;
  totals: {
    total: number;
    byChannel: Record<string, number>;
    byMarket: Record<string, number>;
    byScope: Record<string, number>;
  };
}

export default function ReportActions({ organization, activities, getDisplayCO2, totals }: ReportActionsProps) {
  const [offsetDialogOpen, setOffsetDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<'compliance' | 'voluntary' | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [wantsCertification, setWantsCertification] = useState(false);
  
  const [pdfFormData, setPdfFormData] = useState<PDFFormData>({
    name: '',
    email: '',
    companyName: organization.name || '',
    phoneNumber: '',
    disclosureFormat: 'SECR'
  });

  const CERTIFICATION_PRICE = 199; // USD

  const exportCSV = () => {
    if (activities.length === 0) {
      alert('Please add some marketing activities before exporting.');
      return;
    }
    const headers = ["Date", "Market", "Campaign", "Channel", "Scope", "Activity", "Quantity", "CO2e_kg"];
    const rows = activities.map(activity => [
      activity.date,
      activity.market,
      activity.campaign || "",
      activity.channel,
      activity.scope.toString(),
      activity.activityLabel,
      activity.qty.toString(),
      (Math.round(getDisplayCO2(activity) * 10000) / 10000).toString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const orgName = organization.name ? organization.name.replace(/[^a-zA-Z0-9]/g, '_') : 'CarbonCut';
    a.download = `${orgName}_Marketing_Emissions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePDFGeneration = async () => {
    if (activities.length === 0) {
      alert('Please add some marketing activities before generating a report.');
      return;
    }

    // Validate form
    if (!pdfFormData.name || !pdfFormData.email || !pdfFormData.companyName || !pdfFormData.phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    if (wantsCertification) {
      alert(`Certification selected! You will be redirected to payment ($${CERTIFICATION_PRICE} USD) after the PDF is generated.`);
    }

    setGeneratingPDF(true);
    
    try {
      await generateCarbonEmissionsReport({
        organization,
        activities,
        getDisplayCO2,
        totals,
        formData: pdfFormData
      });
      
      if (wantsCertification) {
        setTimeout(() => {
          alert(`Please complete payment of $${CERTIFICATION_PRICE} USD for your Optiminastic Carbon Footprint Certification. You will receive your certified report within 2-3 business days.`);
        }, 1000);
      }
      
      setPdfDialogOpen(false);
      // Reset form
      setPdfFormData({
        name: '',
        email: '',
        companyName: organization.name || '',
        phoneNumber: '',
        disclosureFormat: 'SECR'
      });
      setWantsCertification(false);
    } catch (error) {
      alert('Error generating PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleMarketSelection = (marketType: 'compliance' | 'voluntary') => {
    setSelectedMarket(marketType);
    console.log(`Selected market: ${marketType}`);
  };

  const handlePdfFormChange = (field: keyof PDFFormData, value: string) => {
    setPdfFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
   <Card className="shadow-sm border border-gray-200 bg-white">
  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="text-center md:text-left mb-4 md:mb-0">
      <h4 className="font-bold text-gray-900 text-base md:text-lg">Want to neutralise your impact?</h4>
      <p className="text-sm text-gray-600 mt-1">
        Talk to us about insetting/offsetting options and how to reduce future emissions.
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
      <Button 
        variant="outline" 
        onClick={exportCSV}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-2 h-auto"
      >
        Export CSV
      </Button>
      
      {/* PDF Download Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-2 h-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-gray-200 text-gray-900  w-full max-w-full
          sm:max-w-lg
          md:max-w-4xl
          h-auto
          sm:h-[650px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              Download PDF Report
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Please provide your details to generate a customized carbon emissions report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            {/* Form Fields in Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdf-name" className="text-sm font-medium text-gray-900">
                    Full Name *
                  </Label>
                  <Input
                    id="pdf-name"
                    type="text"
                    value={pdfFormData.name}
                    onChange={(e) => handlePdfFormChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pdf-email" className="text-sm font-medium text-gray-900">
                    Email Address *
                  </Label>
                  <Input
                    id="pdf-email"
                    type="email"
                    value={pdfFormData.email}
                    onChange={(e) => handlePdfFormChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pdf-company" className="text-sm font-medium text-gray-900">
                    Company Name *
                  </Label>
                  <Input
                    id="pdf-company"
                    type="text"
                    value={pdfFormData.companyName}
                    onChange={(e) => handlePdfFormChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdf-phone" className="text-sm font-medium text-gray-900">
                    Phone Number *
                  </Label>
                  <Input
                    id="pdf-phone"
                    type="tel"
                    value={pdfFormData.phoneNumber}
                    onChange={(e) => handlePdfFormChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Disclosure Format *
                  </Label>
                  <Select 
                    value={pdfFormData.disclosureFormat} 
                    onValueChange={(value: 'SECR' | 'CSRD' | 'SEC') => handlePdfFormChange('disclosureFormat', value)}
                  >
                    <SelectTrigger className="border-gray-300 text-gray-900 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="SECR" className="text-gray-900 hover:bg-gray-50">
                        SECR (Streamlined Energy & Carbon Reporting)
                      </SelectItem>
                      <SelectItem value="CSRD" className="text-gray-900 hover:bg-gray-50">
                        CSRD (Corporate Sustainability Reporting Directive)
                      </SelectItem>
                      <SelectItem value="SEC" className="text-gray-900 hover:bg-gray-50">
                        SEC (Securities and Exchange Commission)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Certification Option - Takes remaining space */}
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="certification"
                      checked={wantsCertification}
                      onCheckedChange={(checked) => setWantsCertification(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Award className="h-4 w-4 text-amber-600" />
                        <Label htmlFor="certification" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Get Certified by Optiminastic
                        </Label>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                          PAID
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Receive an official carbon footprint certification from Optiminastic. 
                        Includes third-party verification and audit trail for compliance reporting.
                      </p>
                    </div>
                  </div>
                  {wantsCertification && (
                    <div className="mt-3 p-3 bg-white border border-amber-200 rounded text-xs">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <CreditCard className="h-3 w-3" />
                        <span className="font-medium">Price: ${CERTIFICATION_PRICE} USD</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                        <div>• Professional certification seal</div>
                        <div>• Third-party verification</div>
                        <div>• 2-3 business days delivery</div>
                        <div>• Compliance-ready documentation</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setPdfDialogOpen(false);
                setWantsCertification(false);
              }}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePDFGeneration}
              disabled={generatingPDF}
              className={`flex-1 font-medium ${
                wantsCertification 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {generatingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : wantsCertification ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay & Certify (${CERTIFICATION_PRICE})
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={offsetDialogOpen} onOpenChange={setOffsetDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-3 py-2 h-auto">
            Offset with CarbonCut
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Choose Your Carbon Offset Market
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Select the carbon offset market that best fits your organization&apos;s needs and compliance requirements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
            {/* Compliance Market */}
            <Card 
              className={`bg-white border-gray-200 hover:border-blue-300 transition-all cursor-pointer group shadow-sm ${
                selectedMarket === 'compliance' ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
              }`}
              onClick={() => handleMarketSelection('compliance')}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Compliance Market</h3>
                      <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                        Regulated
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Government-regulated carbon credits for organizations with mandatory emission reduction targets. 
                      Higher verification standards and regulatory oversight.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Regulatory compliance</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Mandatory reporting</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Strict verification</span>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedMarket === 'compliance' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Compliance Market Selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voluntary Market */}
            <Card 
              className={`bg-white border-gray-200 hover:border-blue-300 transition-all cursor-pointer group shadow-sm ${
                selectedMarket === 'voluntary' ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
              }`}
              onClick={() => handleMarketSelection('voluntary')}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                    <Leaf className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Voluntary Market</h3>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        Flexible
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Market-driven carbon credits for voluntary sustainability commitments. 
                      More flexibility in project selection and faster implementation.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Corporate sustainability</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Project variety</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Cost-effective</span>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedMarket === 'voluntary' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Voluntary Market Selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Total emissions to offset:</strong> {totals.total.toFixed(2)} kg CO₂e
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMarket 
                    ? `You have selected the ${selectedMarket} market for your carbon offset strategy.`
                    : 'Please select a market to proceed with your offset strategy.'
                  }
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </CardContent>
</Card>
  );
}
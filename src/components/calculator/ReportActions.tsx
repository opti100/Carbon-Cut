"use client";

import React, { useState } from 'react';
import { ActivityData, OrganizationData } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Leaf, Building2, Download, Loader2, Award, CreditCard, Mail, Shield, ArrowRight } from "lucide-react";
import { PDFFormData } from "@/services/report-formats/secr-report";

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
  
  // OTP states
  const [otpStep, setOtpStep] = useState<'form' | 'verify' | 'verified'>('form');
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
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

  const handleSendOTP = async () => {
    if (!pdfFormData.email || !pdfFormData.name) {
      setOtpMessage('Please enter your name and email address.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pdfFormData.email)) {
      setOtpMessage('Please enter a valid email address.');
      return;
    }

    setSendingOTP(true);
    setOtpMessage('');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pdfFormData.email,
          name: pdfFormData.name,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpStep('verify');
        setOtpMessage('OTP sent to your email. Please check your inbox.');
      } else {
        setOtpMessage(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpMessage('Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setVerifyingOTP(true);
    setOtpMessage('');

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pdfFormData.email,
          otp: otpCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUserId(result.userId);
        setOtpStep('verified');
        setOtpMessage('Email verified successfully! You can now download your PDF report.');
      } else {
        setOtpMessage(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpMessage('Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handlePDFDownload = async () => {
    if (activities.length === 0) {
      alert('Please add some marketing activities before generating a report.');
      return;
    }

    if (otpStep !== 'verified' || !userId) {
      alert('Please verify your email first.');
      return;
    }

    // Validate required fields
    if (!pdfFormData.name || !pdfFormData.email || !pdfFormData.companyName || !pdfFormData.phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    setGeneratingPDF(true);
    
    try {
      // Update user information in database
      await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pdfFormData.email,
          name: pdfFormData.name,
          phoneNumber: pdfFormData.phoneNumber,
          companyName: pdfFormData.companyName,
        }),
      });

      // Create report data for API
      const reportData = {
        organization,
        activities,
        totals,
        formData: {
          ...pdfFormData,
          wantsCertification
        },
        displayCO2Data: activities.reduce((acc, activity) => {
          acc[activity.id] = getDisplayCO2(activity);
          return acc;
        }, {} as Record<number, number>)
      };

      // Call API to generate PDF
      const response = await fetch('/api/reports/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate PDF');
      }

      // If certification was requested, show payment message
      if (wantsCertification) {
        alert(`Certification requested! Please complete payment of $${CERTIFICATION_PRICE} USD for your Optiminastic Carbon Footprint Certification. You will receive your certified report within 2-3 business days.`);
      }

      // If PDF was successfully uploaded to cloud, show success message
      if (result.pdfUrl) {
        alert('PDF generated and saved to your account! You can access it from your dashboard.');
        
        // Also trigger direct download
        const downloadResponse = await fetch(`/api/reports/${result.report.id}/download`);
        const downloadResult = await downloadResponse.json();
        
        if (downloadResult.success && downloadResult.pdfUrl) {
          // Open PDF in new tab for download
          window.open(downloadResult.pdfUrl, '_blank');
        }
      } else {
        // Fallback: Generate PDF for direct download
        await generateDirectPDF();
      }
      
      setPdfDialogOpen(false);
      resetPdfForm();
    } catch (error) {
      console.error('Error generating PDF report:', error);
      
      // Fallback: Try direct PDF generation
      try {
        await generateDirectPDF();
        setPdfDialogOpen(false);
        resetPdfForm();
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        alert('Error generating PDF report. Please try again.');
      }
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Fallback method for direct PDF download
  const generateDirectPDF = async () => {
    try {
      const response = await fetch('/api/reports/generate-pdf-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization,
          activities,
          totals,
          formData: pdfFormData,
          displayCO2Data: activities.reduce((acc, activity) => {
            acc[activity.id] = getDisplayCO2(activity);
            return acc;
          }, {} as Record<number, number>)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFormData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfFormData.disclosureFormat}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Direct PDF generation failed:', error);
      throw error;
    }
  };

  const resetPdfForm = () => {
    setPdfFormData({
      name: '',
      email: '',
      companyName: organization.name || '',
      phoneNumber: '',
      disclosureFormat: 'SECR'
    });
    setWantsCertification(false);
    setOtpStep('form');
    setOtpCode('');
    setOtpMessage('');
    setUserId(null);
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

  const handleResendOTP = () => {
    setOtpCode('');
    setOtpMessage('');
    handleSendOTP();
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
      <Dialog open={pdfDialogOpen} onOpenChange={(open) => {
        setPdfDialogOpen(open);
        if (!open) {
          resetPdfForm();
        }
      }}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-2 h-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-gray-200 text-gray-900 w-full max-w-full sm:max-w-lg md:max-w-4xl h-auto sm:h-[650px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              Download PDF Report
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {otpStep === 'form' && 'Please provide your details to generate a customized carbon emissions report.'}
              {otpStep === 'verify' && 'Please enter the verification code sent to your email.'}
              {otpStep === 'verified' && 'Email verified! Complete the form to download your report.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  otpStep === 'form' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {otpStep === 'form' ? '1' : <CheckCircle className="h-4 w-4" />}
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
                
                <ArrowRight className="mx-3 h-4 w-4 text-gray-400" />
                
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  otpStep === 'verify' ? 'bg-blue-500 text-white' : 
                  otpStep === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {otpStep === 'verified' ? <CheckCircle className="h-4 w-4" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Verify</span>
                
                <ArrowRight className="mx-3 h-4 w-4 text-gray-400" />
                
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  otpStep === 'verified' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Download</span>
              </div>
            </div>

            {otpStep === 'verify' && (
              <div className="max-w-md mx-auto text-center">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                  <Mail className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We&apos;ve sent a 6-digit verification code to:<br />
                    <strong>{pdfFormData.email}</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-900">
                        Enter Verification Code
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="text-center text-lg font-mono tracking-widest mt-2"
                        maxLength={6}
                      />
                    </div>
                    
                    {otpMessage && (
                      <div className={`text-sm p-3 rounded ${
                        otpMessage.includes('successfully') || otpMessage.includes('sent')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {otpMessage}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setOtpStep('form')}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={verifyingOTP || otpCode.length !== 6}
                        className="flex-1"
                      >
                        {verifyingOTP ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Verify
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleResendOTP}
                      variant="ghost"
                      size="sm"
                      disabled={sendingOTP}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {sendingOTP ? 'Sending...' : 'Resend Code'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            {(otpStep === 'form' || otpStep === 'verified') && (
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
                      disabled={otpStep === 'verified'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pdf-email" className="text-sm font-medium text-gray-900">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="pdf-email"
                        type="email"
                        value={pdfFormData.email}
                        onChange={(e) => handlePdfFormChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                        disabled={otpStep === 'verified'}
                      />
                      {otpStep === 'verified' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
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

                  {/* Certification Option - only show when verified */}
                  {otpStep === 'verified' && (
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
                  )}
                </div>
              </div>
            )}

            {/* OTP Message for form step */}
            {otpStep === 'form' && otpMessage && (
              <div className={`mt-4 text-sm p-3 rounded ${
                otpMessage.includes('successfully') || otpMessage.includes('sent')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {otpMessage}
              </div>
            )}

            {/* Success message for verified step */}
            {otpStep === 'verified' && otpMessage && (
              <div className="mt-4 text-sm p-3 rounded bg-green-50 text-green-700 border border-green-200">
                {otpMessage}
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setPdfDialogOpen(false);
                resetPdfForm();
              }}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            
            {otpStep === 'form' && (
              <Button
                onClick={handleSendOTP}
                disabled={sendingOTP || !pdfFormData.email || !pdfFormData.name}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {sendingOTP ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            )}
            
            {otpStep === 'verified' && (
              <Button
                onClick={handlePDFDownload}
                disabled={generatingPDF || !pdfFormData.companyName || !pdfFormData.phoneNumber}
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
                    <a href="https://buy.stripe.com/3cIeVdc8ObEpeMqgDH08g00" 
   target="_blank" 
   rel="noopener noreferrer">
   Get Certified PDF - $200
</a>
                    Download & Pay (${CERTIFICATION_PRICE})
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Offset Dialog - keeping existing functionality */}
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
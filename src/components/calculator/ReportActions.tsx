"use client";

import React, { useState } from 'react';
import { ActivityData, OrganizationData } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Loader2, Award, Cloud, Database } from "lucide-react";
import { PDFFormData } from "@/services/report-formats/secr-report";
import { FormStep, StepIndicator, VerificationStep } from './OptSteps';
import OffsetDialog from './OffSetDialog';
import Link from 'next/link';
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
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [wantsCertification, setWantsCertification] = useState(false);

  const [otpStep, setOtpStep] = useState<'form' | 'verify' | 'verified'>('form');
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const [pdfFormData, setPdfFormData] = useState<PDFFormData>({
    name: '',
    email: '',
    companyName: organization.name || '',
    phoneNumber: '',
    disclosureFormat: 'SECR'
  });

  const CERTIFICATION_PRICE = 199;

  const handleSendOTP = async () => {
    if (!pdfFormData.email || !pdfFormData.name) {
      setOtpMessage('Please enter your name and email address.');
      return;
    }
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
    setUploadProgress('Initializing...');

    try {

      setUploadProgress('Updating user information...');
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

      setUploadProgress('Preparing report data...');
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

      setUploadProgress('Generating PDF report...');
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

      setUploadProgress('PDF generated successfully!');

      if (wantsCertification) {
        setUploadProgress('Preparing certification payment...');

        try {
          const checkoutResponse = await fetch('/api/stripe/create-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reportId: result.report.id,
              email: pdfFormData.email,
              companyName: pdfFormData.companyName,
              amount: CERTIFICATION_PRICE * 100
            }),
          });

          const checkoutResult = await checkoutResponse.json();

          if (checkoutResult.success && checkoutResult.url) {
            setUploadProgress('Redirecting to payment...');

            // Show message before redirect
            alert(`Your report has been generated! You will now be redirected to complete the certification payment of $${CERTIFICATION_PRICE}. After payment, the certified PDF will be emailed to you.`);

            // Redirect to Stripe checkout
            window.location.href = checkoutResult.url;
            return;
          } else {
            console.error('Checkout session creation failed:', checkoutResult);
            throw new Error(checkoutResult.error || checkoutResult.details || 'Failed to create payment session');
          }
        } catch (paymentError) {
          console.error('Payment setup failed:', paymentError);
          setUploadProgress('Payment setup failed, but regular report is available');

          // Show detailed error message
          const errorMessage = paymentError instanceof Error ? paymentError.message : 'Unknown payment error';
          alert(`Payment setup failed: ${errorMessage}\n\nYour regular report has been generated and you can download it below. You can try certification later from your dashboard.`);

          // Continue with regular PDF flow
        }
      }

      // Handle regular PDF (non-certified) or fallback
      if (result.pdfUrl) {
        setUploadProgress('Report saved to cloud storage!');

        // Send regular PDF via email
        try {
          setUploadProgress('Sending PDF to your email...');
          await fetch('/api/reports/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reportId: result.report.id,
              email: pdfFormData.email
            }),
          });
          setUploadProgress('PDF sent to your email!');
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          setUploadProgress('Report saved! Email sending failed.');
        }

        const message = 'PDF report generated and saved to your account! A copy has been sent to your email.';
        alert(message);

        // Try automatic download
        try {
          setUploadProgress('Preparing download...');
          const downloadSuccess = await downloadReport(result.report.id);

          if (downloadSuccess) {
            setUploadProgress('Download started!');
          } else {
            setUploadProgress('Report saved! Visit dashboard to download.');
          }
        } catch (downloadError) {
          console.warn('Could not trigger automatic download:', downloadError);
          setUploadProgress('Report saved! Visit dashboard to download.');
        }
      } else {
        setUploadProgress('Preparing direct download...');
        await generateDirectPDF();
      }

      // Success cleanup
      setTimeout(() => {
        setPdfDialogOpen(false);
        resetPdfForm();
      }, 1500);

    } catch (error) {
      console.error('Error in PDF generation process:', error);
      setUploadProgress('Error occurred, trying fallback...');

      // Fallback: Try direct PDF generation
      try {
        await generateDirectPDF();
        setTimeout(() => {
          setPdfDialogOpen(false);
          resetPdfForm();
        }, 1000);
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        setUploadProgress('');
        alert('Error generating PDF report. Please try again or contact support.');
      }
    } finally {
      setGeneratingPDF(false);
      // Clear progress after a delay
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  // Fallback direct PDF download
  const generateDirectPDF = async () => {
    try {
      setUploadProgress('Generating direct download...');

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

      setUploadProgress('Downloading PDF...');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFormData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfFormData.disclosureFormat}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setUploadProgress('PDF downloaded successfully!');

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
    setUploadProgress('');
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

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(value);
  };
  const handleOtpKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && otpCode.length === 6) {
      handleVerifyOTP();
    }
  };
  const downloadReport = async (reportId: string) => {
    try {
      console.log('Downloading report:', reportId);

      const response = await fetch(`/api/reports/${reportId}/download`, {
        credentials: 'include'
      });

      // Check if the response is a PDF file
      const contentType = response.headers.get('content-type');

      if (contentType === 'application/pdf') {
        // Direct PDF download
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error('PDF file is empty');
        }

        const url = URL.createObjectURL(blob);

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'carbon_report.pdf';

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);

        console.log('PDF downloaded successfully:', filename);
        return true;
      } else {
        // JSON response with URL
        const result = await response.json();

        if (result.success && result.pdfUrl) {
          // For URL-based downloads, open in new tab
          const link = document.createElement('a');
          link.href = result.pdfUrl;
          link.download = ''; // Let browser determine filename
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return true;
        } else {
          throw new Error(result.error || 'Unable to download report');
        }
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert(`Error downloading report: ${error instanceof Error ? error.message : 'Please try again.'}`);
      return false;
    }
  };

  return (
    <Card className="mb-6 bg-[#fcfdf6] border-0">
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
                
                className="px-4 sm:px-6 md:px-8 text-white text-sm sm:text-base bg-[#6c5f31] hover:bg-[#b0ea1d] "
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900 w-[95vw] max-w-none sm:max-w-lg md:max-w-4xl h-[95vh] sm:h-auto max-h-[95vh] overflow-y-auto p-0">
              <div className="p-4 sm:p-6">
                <DialogHeader className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-black text-left truncate">
                        Download PDF Report
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 text-left text-sm sm:text-base mt-1">
                        Please provide your details to generate a customized carbon footprints report.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex flex-col sm:flex-col lg:flex-row gap-6 mt-6">
                  <StepIndicator otpStep={otpStep} />

                  <div className="flex-1 min-w-0">
                    {otpStep === 'verify' && (
                      <VerificationStep
                        pdfFormData={pdfFormData}
                        otpCode={otpCode}
                        handleOtpChange={handleOtpChange}
                        handleOtpKeyPress={handleOtpKeyPress}
                        otpMessage={otpMessage}
                        setOtpStep={setOtpStep}
                        handleVerifyOTP={handleVerifyOTP}
                        verifyingOTP={verifyingOTP}
                        handleResendOTP={handleResendOTP}
                        sendingOTP={sendingOTP}
                      />
                    )}
                    {(otpStep === 'form' || otpStep === 'verified') && (
                      <FormStep
                        pdfFormData={pdfFormData}
                        handlePdfFormChange={handlePdfFormChange}
                        otpStep={otpStep}
                        wantsCertification={wantsCertification}
                        setWantsCertification={setWantsCertification}
                        CERTIFICATION_PRICE={CERTIFICATION_PRICE}
                      />
                    )}

                    {generatingPDF && uploadProgress && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {uploadProgress.includes('cloud') || uploadProgress.includes('saved') ? (
                              <Cloud className="h-4 w-4 text-blue-600" />
                            ) : uploadProgress.includes('database') || uploadProgress.includes('activities') ? (
                              <Database className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                            )}
                            <span className="text-sm font-medium text-blue-900">
                              {uploadProgress}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {otpStep === 'form' && otpMessage && (
                      <div className={`mt-4 text-sm p-3 rounded ${otpMessage.includes('successfully') || otpMessage.includes('sent')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                        }`}>
                        {otpMessage}
                      </div>
                    )}

                    {otpStep === 'verified' && otpMessage && (
                      <div className="mt-4 text-sm p-3 rounded bg-green-50 text-green-700 border border-green-200">
                        {otpMessage}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {otpStep !== 'verify' && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPdfDialogOpen(false);
                        resetPdfForm();
                      }}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                      type="button"
                      disabled={generatingPDF}
                    >
                      Cancel
                    </Button>

                    {otpStep === 'form' && (
                      <Button
                        onClick={handleSendOTP}
                        disabled={sendingOTP || !pdfFormData.email || !pdfFormData.name}
                        className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium text-sm"
                        type="button"
                      >
                        {sendingOTP ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          'Send verification code'
                        )}
                      </Button>
                    )}

                    {otpStep === 'verified' && (
                      <Button
                        onClick={handlePDFDownload}
                        disabled={generatingPDF || !pdfFormData.companyName || !pdfFormData.phoneNumber}
                        className={`flex-1 font-medium text-sm ${wantsCertification
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-gray-800 hover:bg-gray-900'
                          } text-white`}
                        type="button"
                      >
                        {generatingPDF ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {uploadProgress ? 'Processing...' : 'Generating...'}
                          </>
                        ) : wantsCertification ? (
                          <>
                            <Award className="mr-2 h-4 w-4" />
                            Get Certified PDF - ${CERTIFICATION_PRICE}
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
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Link href="/offset">
            <Button
              className="bg-[#b0ea1d] text-white font-medium text-sm px-4 py-2.5 h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
            >
              Offset with CarbonCut
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
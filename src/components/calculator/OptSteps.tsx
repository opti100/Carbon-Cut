import { PDFFormData } from "@/services/report-formats/secr-report";
import { ActivityData, OrganizationData } from '@/types/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Leaf, Building2, Download, Loader2, Award, CreditCard, Mail, Shield, X, Cloud, Database, Component } from "lucide-react";
import PhoneInputDemo, { PhoneInput } from '../comp-46';

export const StepIndicator = ({ otpStep }: { otpStep: 'form' | 'verify' | 'verified' }) => (
  <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
    <div className="space-y-4">
      {/* Step 1 */}
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-colors ${
          otpStep === 'form' ? 'bg-green-500 text-white' :
          otpStep === 'verify' || otpStep === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          {otpStep !== 'form' ? <CheckCircle className="h-4 w-4" /> : '1'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm sm:text-base ${otpStep === 'form' ? 'text-green-600' : 'text-gray-900'}`}>
            Details
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter your information
          </p>
        </div>
      </div>

      {/* Connector Line */}
      <div className="flex">
        <div className="w-8 flex justify-center">
          <div className={`w-0.5 h-6 transition-colors ${
            otpStep === 'verify' || otpStep === 'verified' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-colors ${
          otpStep === 'verify' ? 'bg-green-500 text-white' :
          otpStep === 'verified' ? 'bg-green-500 text-white' :
          'bg-gray-300 text-gray-600'
        }`}>
          {otpStep === 'verified' ? <CheckCircle className="h-4 w-4" /> : '2'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm sm:text-base ${otpStep === 'verify' ? 'text-green-600' : 'text-gray-900'}`}>
            Verification
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Verify your email
          </p>
        </div>
      </div>

      {/* Connector Line */}
      <div className="flex">
        <div className="w-8 flex justify-center">
          <div className={`w-0.5 h-6 transition-colors ${
            otpStep === 'verified' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-colors ${
          otpStep === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          3
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm sm:text-base ${otpStep === 'verified' ? 'text-green-600' : 'text-gray-900'}`}>
            Download PDF
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Get your report
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Form Step Component
export const FormStep = ({
  pdfFormData,
  handlePdfFormChange,
  otpStep,
  wantsCertification,
  setWantsCertification,
  CERTIFICATION_PRICE
}: {
  pdfFormData: PDFFormData;
  handlePdfFormChange: (field: keyof PDFFormData, value: string) => void;
  otpStep: 'form' | 'verify' | 'verified';
  wantsCertification: boolean;
  setWantsCertification: (value: boolean) => void;
  CERTIFICATION_PRICE: number;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pdf-name" className="text-sm font-medium text-gray-900">
          Full Name <span className="text-red-500">*</span>
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
          Email Address <span className="text-red-500">*</span>
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
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pdf-company" className="text-sm font-medium text-gray-900">
          Company Name <span className="text-red-500">*</span>
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

      <div className="space-y-2">
        <Label htmlFor="pdf-phone" className="text-sm font-medium text-gray-900">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        {/* <PhoneInputDemo
          inpValue={pdfFormData.phoneNumber}
          onChange={(value) => handlePdfFormChange('phoneNumber', value)} */}
          <Input
           id="pdf-phone"
           type="tel"
           value={pdfFormData.phoneNumber}
           onChange={(e) => handlePdfFormChange('phoneNumber', e.target.value)}
           placeholder="Enter phone number"
          className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div className="sm:col-span-2 space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Disclosure Format <span className="text-red-500">*</span>
        </Label>
        <Select
          value={pdfFormData.disclosureFormat}
          onValueChange={(value: 'SECR' | 'CSRD' | 'SEC') => handlePdfFormChange('disclosureFormat', value)}
        >
          <SelectTrigger className="border-gray-300 text-gray-900 focus:border-blue-500">
            <SelectValue placeholder="Select Format" />
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Award className="h-4 w-4 text-amber-600 flex-shrink-0" />
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
                <CreditCard className="h-3 w-3 flex-shrink-0" />
                <span className="font-medium">Price: ${CERTIFICATION_PRICE} USD</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                <div>• Professional certification seal</div>
                <div>• Compliance-ready documentation</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

// Verification Step Component
export const VerificationStep = ({
  pdfFormData,
  otpCode,
  handleOtpChange,
  handleOtpKeyPress,
  otpMessage,
  setOtpStep,
  handleVerifyOTP,
  verifyingOTP,
  handleResendOTP,
  sendingOTP
}: {
  pdfFormData: PDFFormData;
  otpCode: string;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtpKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  otpMessage: string;
  setOtpStep: (step: 'form' | 'verify' | 'verified') => void;
  handleVerifyOTP: () => void;
  verifyingOTP: boolean;
  handleResendOTP: () => void;
  sendingOTP: boolean;
}) => (
  <div className="w-full max-w-md mx-auto text-center">
    <div className="p-4 sm:p-6 rounded-lg mb-6">
      <Mail className="h-12 w-12 text-green-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
      <p className="text-sm text-gray-600 mb-4">
        We&apos;ve sent a 6-digit verification code to:<br />
        <strong className="break-words">{pdfFormData.email}</strong>
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="otp-input" className="text-sm font-medium text-gray-900 block mb-2">
            Enter Verification Code
          </Label>
          <Input
            id="otp-input"
            type="text"
            value={otpCode}
            onChange={handleOtpChange}
            onKeyPress={handleOtpKeyPress}
            placeholder="000000"
            className="text-center text-lg font-mono tracking-widest border-gray-300 focus:border-blue-500 max-w-xs mx-auto"
            maxLength={6}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter the 6-digit code sent to your email
          </p>
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

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setOtpStep('form')}
            variant="outline"
            className="flex-1 text-sm"
            type="button"
          >
            Back
          </Button>
          <Button
            onClick={handleVerifyOTP}
            disabled={verifyingOTP || otpCode.length !== 6}
            className="flex-1 text-sm bg-orange-500 hover:bg-orange-600"
            type="button"
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
          className="text-blue-600 hover:text-blue-700 text-sm"
          type="button"
        >
          {sendingOTP ? 'Sending...' : 'Resend Code'}
        </Button>
      </div>
    </div>
  </div>
);


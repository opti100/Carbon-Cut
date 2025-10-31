"use client";

import { useState } from "react";
import ConnectGoogleAds from "@/components/live/ConnectGoogleAds";
import CreateApiKey from "@/components/live/CreateApiKey";
import CreateCampaign from "@/components/live/CreateCampaign";
import CampaignStatus from "@/components/live/CampaignStatus";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';


const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
 
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#10b981',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#10b981',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#e5e7eb',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export default function Page() {
  // const [activeStep, setActiveStep] = useState(0); // MUI uses 0-based indexing
   const [activeStep, setActiveStep] = useState(1); // 1-based indexing for easier understanding
   const [currentStep,setCurrentStep] = useState(1); // 1-based indexing for easier understanding

  const steps = [
    'Connect Google Ads Account',
    'Create API Key & SDK',
    'Create Campaign',
    'Campaign Status',
  ];

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        
        {/* Progress Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-full">
          <div className="flex flex-col">
            
            {/* Material-UI Stepper */}
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                connector={<CustomStepConnector />}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel 
                      StepIconProps={{
                        sx: {
                          '&.Mui-completed': {
                            color: '#10b981',
                          },
                          '&.Mui-active': {
                            color: '#10b981',
                          },
                        }
                      }}
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {label}
                      </span>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Content Area */}
            <div className="w-full bg-neutral-50 rounded-lg p-6 sm:p-8 mt-4 min-h-[300px] sm:min-h-[350px] flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700 mb-3">
                  {steps[activeStep]}
                </p>
                <p className="text-gray-500 mb-6">
                  {activeStep === 0 && "Connect your Google Ads account to get started"}
                  {activeStep === 1 && "Generate API keys and set up the SDK"}
                  {activeStep === 2 && "Create and configure your advertising campaign"}
                  {activeStep === 3 && "Monitor your campaign performance and status"}
                </p>
                
                {/* Step Navigation Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                    disabled={activeStep === 0}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Uncomment if you want to use the original grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 mt-8">
          <ConnectGoogleAds isActive={currentStep === 1} isCompleted={currentStep > 1} onComplete={() => setCurrentStep(2)} />
          <CreateApiKey isActive={currentStep === 2} isCompleted={currentStep > 2} onComplete={() => setCurrentStep(3)} />
          <CreateCampaign isActive={currentStep === 3} isCompleted={currentStep > 3} onComplete={() => setCurrentStep(4)} />
          <CampaignStatus isActive={currentStep === 4} isCompleted={currentStep > 4} />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
  const [currentStep, setCurrentStep] = useState(1); // 1-based indexing for easier understanding

  // Sync Material-UI stepper with current step (convert to 0-based)
  const activeStepForMUI = currentStep - 1;

  const steps = [
    'Connect Google Ads Account',
    'Create API Key & SDK', 
    'Create Campaign',
    'Campaign Status',
  ];

  // Handle step completion and auto-advance
  const handleStepComplete = (stepNumber: number) => {
    if (stepNumber === currentStep) {
      setCurrentStep(stepNumber + 1);
    }
  };

  return (
    <>
      <div className="  rounded-lg flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-7xl h-full flex flex-col mt-20">
          
          {/* Progress Card */}
          <div className=" rounded-xl p-6 w-full shrink-0">
            
            {/* Material-UI Stepper - Synced with currentStep */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <Stepper 
                activeStep={activeStepForMUI}
                alternativeLabel
                connector={<CustomStepConnector />}
              >
                {steps.map((label, index) => (
                  <Step key={label} completed={currentStep > index + 1}>
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
          {/* </div> */}

          {/* Four Cards Section - Flex-1 to take remaining space */}
          {/* <div className="flex-1 bg-white shadow-lg rounded-xl p-6 mt-4 overflow-auto"> */}
            <div className="h-full flex flex-col">
              
              {/* Current Step Title */}
              <div className="text-center mb-6">
                {/* <p className="text-xl font-semibold text-gray-700">
                  Step {currentStep}: {steps[currentStep - 1]}
                </p> */}
                {/* <p className="text-gray-500 text-sm mt-2">
                  {currentStep === 1 && "Connect your Google Ads account to get started"}
                  {currentStep === 2 && "Generate API keys and set up the SDK"} 
                  {currentStep === 3 && "Create and configure your advertising campaign"}
                  {currentStep === 4 && "Monitor your campaign performance and status"}
                </p> */}
              </div>

              {/* Four Cards Grid - Fixed minimal height for all cards */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
                {/* All cards have same fixed height: h-64 = 256px (minimal height) */}
                <div className="h-74"> 
                  <ConnectGoogleAds 
                    isActive={currentStep === 1} 
                    isCompleted={currentStep > 1} 
                    onComplete={() => handleStepComplete(1)} 
                  />
                </div>
                
                <div className="h-74"> 
                  <CreateApiKey 
                    isActive={currentStep === 2} 
                    isCompleted={currentStep > 2} 
                    onComplete={() => handleStepComplete(2)} 
                  />
                </div>
                
                <div className="h-74">
                  <CreateCampaign 
                    isActive={currentStep === 3} 
                    isCompleted={currentStep > 3} 
                    onComplete={() => handleStepComplete(3)} 
                  />
                </div>
                
                <div className="h-74"> 
                  <CampaignStatus 
                    isActive={currentStep === 4} 
                    isCompleted={currentStep > 4} 
                  />
                </div>
              </div>

              {/* Navigation Buttons - COMMENTED OUT */}
              {/*
              <div className="flex justify-center gap-4 mt-6 flex-shrink-0">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
                  disabled={currentStep === steps.length}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              */}
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
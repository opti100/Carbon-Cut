// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import CloudProvider from './CloudProvider'
// import Cdn from './Cdn'
// import { StepProgress } from './stepProgress'
// import OnPrem from './OnPrem'
// import TravellingDetails from './TravelDetails'
// import { StepsSidebar } from './StepSidebar'
// import CardNav from '../CardNav'
// import { navData } from '../NavData'
// import Sdk from './Sdk'
// import { useOnboarding, useOnboardingStep } from '@/hooks/onboarding'
// import { 
//   CloudProviderData, 
//   CdnData, 
//   OnPremData, 
//   WorkforceEmissionsData, 
//   TravelData,
//   EnergyData,
//   AdsData,
//   MachineryData,
//   OilGasData,
//   TravelItem,
//   EnergySource,
//   AdCampaign,
//   Machine,
//   OilGasConsumption
// } from '@/types/onboarding'
// const TOTAL_STEPS = 9

// const STEP_TITLES: Record<number, string> = {
//   1: 'Tell us about your cloud usage',
//   2: 'Configure your CDN traffic',
//   3: 'Describe your on‑prem infrastructure',
//   4: 'How many employees do you have?',
//   5: 'Add your company travel details',
//   6: 'Add your energy consumption',
//   7: 'Tell us about your online advertising',
//   8: 'Add your machinery & equipment',
//   9: 'Oil, gas & lubricant usage',
// }

// const STEP_SUBTITLES: Record<number, string> = {
//   1: "We'll use this to estimate the emissions from your cloud providers.",
//   2: 'Traffic and regions help us understand your delivery footprint.',
//   3: 'Servers and utilisation levels drive on‑prem energy consumption.',
//   4: 'Employee count and workspace size shape your workforce emissions profile.',
//   5: 'Business trips and commutes contribute to your overall footprint.',
//   6: 'Electricity and fuel used in your offices and facilities.',
//   7: 'Digital advertising has a measurable carbon footprint per impression.',
//   8: 'Combustion engines and industrial equipment produce direct emissions.',
//   9: 'Industrial oils, lubricants and gases have upstream carbon costs.',
// }

// export default function VTwoFlow() {
//   const router = useRouter()
//   const [step, setStep] = useState(1)
//   const [stepErrors, setStepErrors] = useState<Record<number, string | null>>({})

//   // ---- Onboarding hooks ----
//   const {
//     status,
//     isStatusLoading,
//     isComplete,
//     completedSteps,
//     completeOnboarding,
//     isCompleting,
//     isSaving,
//   } = useOnboarding()

//   // Per-step hooks
//   const cloudStep = useOnboardingStep({
//     step: 1,
//     onSuccess: () => setStep(2),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 1: e.message })),
//   })

//   const cdnStep = useOnboardingStep({
//     step: 2,
//     onSuccess: () => setStep(3),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 2: e.message })),
//   })

//   const onpremStep = useOnboardingStep({
//     step: 3,
//     onSuccess: () => setStep(4),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 3: e.message })),
//   })

//   const workforceStep = useOnboardingStep({
//     step: 4,
//     onSuccess: () => setStep(5),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 4: e.message })),
//   })

//   const energyStep = useOnboardingStep({
//     step: 6,
//     onSuccess: () => setStep(7),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 6: e.message })),
//   })

//   const adsStep = useOnboardingStep({
//     step: 7,
//     onSuccess: () => setStep(8),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 7: e.message })),
//   })

//   const machineryStep = useOnboardingStep({
//     step: 8,
//     onSuccess: () => setStep(9),
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 8: e.message })),
//   })

//   const oilGasStep = useOnboardingStep({
//     step: 9,
//     onSuccess: async () => {
//       try { await completeOnboarding() } finally { router.push('/dashboard/cloud') }
//     },
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 9: e.message })),
//   })

//   const travelStep = useOnboardingStep({
//     step: 5,
//     onSuccess: async () => {
//       try {
//         await completeOnboarding()
//         router.push('/dashboard/cloud')
//       } catch {
//         // Still navigate — onboarding data is saved
//         router.push('/dashboard/cloud')
//       }
//     },
//     onError: (e) => setStepErrors((prev) => ({ ...prev, 5: e.message })),
//   })

//   // ---- Redirect if already onboarded ----
//   useEffect(() => {
//     if (isComplete) {
//       router.push('/dashboard/cloud')
//     }
//   }, [isComplete, router])

//   // ---- Restore progress from server ----
//   useEffect(() => {
//     if (status?.steps) {
//       const stepOrder = ['cloud', 'cdn', 'onprem', 'workforce', 'travel'] as const
//       let firstIncomplete = 1
//       for (let i = 0; i < stepOrder.length; i++) {
//         if (!status.steps[stepOrder[i]].completed) {
//           firstIncomplete = i + 1
//           break
//         }
//         firstIncomplete = i + 2 // all done → past last step
//       }
//       if (firstIncomplete <= TOTAL_STEPS) {
//         setStep(firstIncomplete)
//       }
//     }
//   }, [status])

//   // ---- Form state ----
//   const [cloudProviderData, setCloudProviderData] = useState<CloudProviderData>({
//     tabType: 'Manual',
//     actualCost: '',
//     monthlyHoursUsage: '',
//     region: '',
//     uploadedFile: null,
//     cloud: '',
//     isManualOpen: false,
//     isUploadOpen: false,
//   })

//   const [cdnData, setCdnData] = useState<CdnData>({
//     cdnProvider: '',
//     monthlyGBTransferred: '',
//     regions: '',
//   })

//   const [workforceEmissionsData, setWorkforceEmissionsData] = useState<WorkforceEmissionsData>({
//     workforceLocations: [],
//     workforceType: '',
//     workArrangementRemote: '',
//     country: '',
//     state: '',
//     city: '',
//     squareMeters: '',
//   })

//   const [onPremData, setOnPremData] = useState<OnPremData>({
//     name: '',
//     cpuCores: '',
//     ramGB: '',
//     storageTB: '',
//     avgCpuUtilization: '',
//     hoursPerDay: '',
//   })

//   const [travelData, setTravelData] = useState<TravelData>({
//     travels: [{ travel_type: '', isOpen: true }],
//   })
//   // Energy
//   const [energyData, setEnergyData] = useState<EnergyData>({
//     energy_sources: [{ source_type: '', monthly_kwh: '', monthly_liters: '', country_code: '', label: '', isOpen: true }],
//   })

//   // Ads
//   const [adsData, setAdsData] = useState<AdsData>({
//     ad_campaigns: [{ platform: '', ad_format: '', monthly_impressions: '', label: '', isOpen: true }],
//   })

//   // Machinery
//   const [machineryData, setMachineryData] = useState<MachineryData>({
//     machines: [{ machine_type: '', fuel_type: '', monthly_hours: '', fuel_consumption_rate_l_per_hour: '', monthly_kwh: '', label: '', isOpen: true }],
//   })

//   // Oil/gas
//   const [oilGasData, setOilGasData] = useState<OilGasData>({
//     consumptions: [{ product_type: '', monthly_liters: '', label: '', isOpen: true }],
//   })
  

//   // ---- Validation (unchanged) ----
//   const isStep1Valid = () => {
//     if (cloudProviderData.tabType === 'Manual') {
//       return (
//         cloudProviderData.cloud !== '' &&
//         cloudProviderData.region !== '' &&
//         cloudProviderData.actualCost !== '' &&
//         cloudProviderData.monthlyHoursUsage !== ''
//       )
//     } else if (cloudProviderData.tabType === 'Upload') {
//       return cloudProviderData.cloud !== '' && cloudProviderData.uploadedFile !== null
//     }
//     return false
//   }

//   const isStep2Valid = () =>
//     cdnData.cdnProvider !== '' && cdnData.monthlyGBTransferred !== '' && cdnData.regions !== ''

//   const isStep3Valid = () =>
//     onPremData.cpuCores !== '' && onPremData.ramGB !== '' && onPremData.storageTB !== ''

//   const isStep4Valid = () => {
//     if (
//       !workforceEmissionsData.workforceLocations ||
//       workforceEmissionsData.workforceLocations.length === 0
//     )
//       return false
//     return workforceEmissionsData.workforceLocations.every(
//       (location) =>
//         location.workforceType !== '' &&
//         location.workArrangementRemote !== '' &&
//         location.country !== '' &&
//         location.squareMeters !== ''
//     )
//   }

//   const isStep5Valid = () => {
//     if (travelData.travels.length === 0) return false
//     return travelData.travels.every((travel: TravelItem) => {
//       const baseValid =
//         travel.travel_type !== '' &&
//         travel.distance_km !== undefined &&
//         travel.distance_km !== '' &&
//         travel.passenger_count !== undefined &&
//         travel.passenger_count !== ''
//       if (travel.travel_type === 'flight') {
//         return (
//           baseValid &&
//           travel.flight_class !== undefined &&
//           travel.flight_class !== '' &&
//           travel.is_domestic !== undefined &&
//           travel.is_domestic !== ''
//         )
//       }
//       return baseValid
//     })
//   }

//   const isStep6Valid = () => {
//     if (energyData.energy_sources.length === 0) return true // Allow skipping
//     return energyData.energy_sources.every((source: EnergySource) => {
//       return source.source_type !== '' && 
//         (source.monthly_kwh !== '' || source.monthly_liters !== '') &&
//         source.country_code !== ''
//     })
//   }

//   const isStep7Valid = () => {
//     if (adsData.ad_campaigns.length === 0) return true // Allow skipping
//     return adsData.ad_campaigns.every((campaign: AdCampaign) => {
//       return campaign.platform !== '' && 
//         campaign.ad_format !== '' && 
//         campaign.monthly_impressions !== ''
//     })
//   }

//   const isStep8Valid = () => {
//     if (machineryData.machines.length === 0) return true // Allow skipping
//     return machineryData.machines.every((machine: Machine) => {
//       return machine.machine_type !== '' && 
//         machine.fuel_type !== '' &&
//         (machine.monthly_hours !== '' || machine.monthly_kwh !== '')
//     })
//   }

//   const isStep9Valid = () => {
//     if (oilGasData.consumptions.length === 0) return true // Allow skipping
//     return oilGasData.consumptions.every((consumption: OilGasConsumption) => {
//       return consumption.product_type !== '' && 
//         consumption.monthly_liters !== ''
//     })
//   }

//   const canProceed = () => {
//   switch (step) {
//     case 1: return isStep1Valid()
//     case 2: return isStep2Valid()
//     case 3: return isStep3Valid()
//     case 4: return isStep4Valid()
//     case 5: return isStep5Valid()
//     case 6: return isStep6Valid()
//     case 7: return isStep7Valid()
//     case 8: return isStep8Valid()
//     case 9: return isStep9Valid()
//     default: return true
//   }
// }

//   // ---- Handlers (now save to backend) ----
//   const handleNext = async () => {
//     if (!canProceed()) return
//     setStepErrors((prev) => ({ ...prev, [step]: null }))

//     switch (step) {
//       case 1:
//         await cloudStep.save(cloudProviderData)
//         break
//       case 2:
//         await cdnStep.save(cdnData)
//         break
//       case 3:
//         await onpremStep.save(onPremData)
//         break
//       case 4:
//         await workforceStep.save(workforceEmissionsData)
//         break
//       case 5:
//         await travelStep.save(travelData)
//         break
//       case 6: await energyStep.save(energyData); break
//       case 7: await adsStep.save(adsData); break
//       case 8: await machineryStep.save(machineryData); break
//       case 9: await oilGasStep.save(oilGasData); break
//     }
//   }

//   const handleSkip = async () => {
//     // Skipped steps just advance without saving
//     if (step === TOTAL_STEPS) {
//       try {
//         await completeOnboarding()
//         router.push('/dashboard/cloud')
//       } catch {
//         router.push('/dashboard/cloud')
//       }
//       return
//     }
//     setStep(step + 1)
//   }

//   const handleStepChange = (newStep: number) => {
//     if (newStep < step) {
//       setStep(newStep)
//       return
//     }
//     if (newStep === step + 1 && canProceed()) {
//       handleNext()
//     }
//   }

//   const currentStepSaving =
//     cloudStep.isSaving ||
//     cdnStep.isSaving ||
//     onpremStep.isSaving ||
//     workforceStep.isSaving ||
//     travelStep.isSaving ||
//     isCompleting

//   const currentError = stepErrors[step] || null

//   const title = STEP_TITLES[step]
//   const subtitle = STEP_SUBTITLES[step]

//   if (isStatusLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#fcfdf6]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#b0ea1d] border-t-transparent" />
//           <p className="text-sm text-neutral-500">Loading your progress...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 z-20 w-full">
//         <CardNav
//           logo="/CarbonCut-fe/CC.svg"
//           logoAlt="CarbonCut Logo"
//           items={navData}
//           baseColor="rgba(255, 255, 255, 0.1)"
//           menuColor="#080c04"
//           buttonBgColor="#b0ea1d"
//           buttonTextColor="#080c04"
//         />
//       </div>
//       <main className="flex min-h-screen justify-center bg-[#fcfdf6] px-2 sm:px-4 lg:px-6 xl:px-12 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-16 lg:pb-20">
//         <div className="flex w-full max-w-7xl gap-4 sm:gap-6 lg:gap-12 xl:gap-20">
//           <div className="hidden xl:block w-48 2xl:w-56 shrink-0">
//             <StepsSidebar currentStep={step} />
//           </div>
//           <div className="flex-1 min-w-0 max-w-full overflow-hidden">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
//               <div className="flex-1 min-w-0">
//                 <StepProgress total={TOTAL_STEPS} current={step} onChange={handleStepChange} />
//               </div>
//               <span className="text-xs sm:text-sm font-semibold text-neutral-700 whitespace-nowrap">
//                 {step}/{TOTAL_STEPS}
//               </span>
//             </div>

//             <div className="my-6 sm:my-8 lg:my-10 flex flex-col gap-4 sm:gap-6 lg:gap-8 md:flex-row md:items-start md:justify-between">
//               <div className="flex-1 space-y-2 sm:space-y-3">
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
//                   {title}
//                 </h1>
//                 <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-full sm:max-w-2xl">
//                   {subtitle}
//                 </p>
//               </div>
//             </div>

//             {/* Error banner for current step */}
//             {currentError && (
//               <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                 <span className="font-medium">Error:</span> {currentError}
//               </div>
//             )}

//             <section className="w-full">
//               {step === 1 && (
//                 <CloudProvider
//                   data={cloudProviderData}
//                   onDataChange={setCloudProviderData}
//                   onNext={handleNext}
//                   onBack={() => setStep(0)}
//                   canProceed={isStep1Valid()}
//                 />
//               )}

//               {step === 2 && (
//                 <Cdn
//                   data={cdnData}
//                   onSkip={handleSkip}
//                   onDataChange={setCdnData}
//                   onBack={() => setStep(1)}
//                   onNext={handleNext}
//                   canProceed={isStep2Valid()}
//                 />
//               )}

//               {step === 3 && (
//                 <OnPrem
//                   data={onPremData}
//                   onDataChange={setOnPremData}
//                   onBack={() => setStep(2)}
//                   onNext={handleNext}
//                   canProceed={isStep3Valid()}
//                 />
//               )}

//               {/* {step === 4 && (
//                 <WorkforceEmissions
//                   data={workforceEmissionsData}
//                   onDataChange={setWorkforceEmissionsData}
//                   onBack={() => setStep(3)}
//                   onNext={handleNext}
//                   onSkip={handleSkip}
//                   canProceed={isStep4Valid()}
//                 />
//               )} */}

//               {step === 5 && (
//                 <TravellingDetails
//                   data={travelData}
//                   onDataChange={setTravelData}
//                   onBack={() => setStep(4)}
//                   onNext={handleNext}
//                   canProceed={isStep5Valid()}
//                   onSkip={handleSkip}
//                 />
//               )}
//             </section>

//             {currentStepSaving && (
//               <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg">
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 Saving...
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </>
//   )
// }
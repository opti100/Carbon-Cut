// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import FloatingInput from "../ui/FloatingInput";
// import { Country } from "country-state-city";
// import { WorkforceEmissionsData, WorkforceItem } from "@/types/onboarding";
// import { onboardingApi } from "@/services/onboarding/onboarding";
// import clsx from "clsx";
// import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
// import { AlertCircleIcon, ChevronDown, Trash2, Loader2, CheckCircle2 } from "lucide-react";

// interface Props {
//   data: WorkforceEmissionsData;
//   onDataChange: (data: WorkforceEmissionsData) => void;
//   onBack: () => void;
//   onNext: () => void;
//   onSkip?: () => void;
//   canProceed: boolean;
// }

// const workforceRangeOptions = [
//   { label: "0-50", value: "0-50" },
//   { label: "50-100", value: "50-100" },
//   { label: "100-500", value: "100-500" },
//   { label: "500-1000", value: "500-1000" },
//   { label: "1000+", value: "1000+" },
// ];

// const workArrangementOptions = [
//   { label: "0%", value: "0" },
//   { label: "0–25%", value: "0-25" },
//   { label: "25%–50%", value: "25-50" },
//   { label: "50–75%", value: "50-75" },
//   { label: "75–100%", value: "75-100" },
// ];

// export default function WorkforceEmissions({
//   data,
//   onDataChange,
//   onBack,
//   onNext,
//   onSkip,
//   canProceed,
// }: Props) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

//   const countryOptions = Country.getAllCountries();
//   const workforceLocations = data.workforceLocations || [];

//   useEffect(() => {
//     if (workforceLocations.length === 0) {
//       onDataChange({
//         ...data,
//         workforceLocations: [{
//           workforceType: "",
//           workArrangementRemote: "",
//           country: "",
//           squareMeters: "",
//           isOpen: true
//         }],
//       });
//     }
//   }, []);

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmitError(null);
//     setSubmitSuccess(null);

//     try {
//       const response = await onboardingApi.submitWorkforce(data);
      
//       if (response.success) {
//         setSubmitSuccess(
//           response.message || 
//           `Successfully calculated ${response.data.total_emissions_kg.toFixed(2)} kg CO₂e for workforce emissions`
//         );
//         // Proceed to next step after short delay
//         setTimeout(() => {
//           onNext();
//         }, 1500);
//       } else {
//         throw new Error('Failed to submit workforce data');
//       }
//     } catch (error: any) {
//       console.error('Error submitting workforce data:', error);
//       setSubmitError(
//         error.error || 
//         error.message || 
//         'Failed to submit workforce data. Please try again.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkipClick = () => {
//     setSubmitError(null);
//     setSubmitSuccess(null);
//     onSkip?.();
//   };

//   const updateWorkforce = (
//     index: number,
//     key: keyof WorkforceItem,
//     value: any
//   ) => {
//     onDataChange({
//       ...data,
//       workforceLocations: workforceLocations.map((item, i) =>
//         i === index ? { ...item, [key]: value } : item
//       ),
//     });
//     setSubmitError(null);
//     setSubmitSuccess(null);
//   };

//   const addWorkforce = () => {
//     onDataChange({
//       ...data,
//       workforceLocations: [
//         ...workforceLocations.map((w) => ({ ...w, isOpen: false })),
//         { 
//           workforceType: "",
//           workArrangementRemote: "",
//           country: "",
//           squareMeters: "",
//           isOpen: true 
//         },
//       ],
//     });
//   };

//   const removeWorkforce = (index: number) => {
//     if (workforceLocations.length <= 1) return;
//     onDataChange({
//       ...data,
//       workforceLocations: workforceLocations.filter((_, i) => i !== index),
//     });
//   };

//   const toggleAccordion = (index: number) => {
//     onDataChange({
//       ...data,
//       workforceLocations: workforceLocations.map((item, i) =>
//         i === index ? { ...item, isOpen: !item.isOpen } : item
//       ),
//     });
//   };

//   return (
//     <div className="w-full space-y-6">
//       {/* Success Message */}
//       {submitSuccess && (
//         <Alert className="bg-green-50 border-green-200">
//           <CheckCircle2 className="h-4 w-4 text-green-600" />
//           <AlertTitle className="text-green-800">Success</AlertTitle>
//           <AlertDescription className="text-green-700">
//             {submitSuccess}
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Error Message */}
//       {submitError && (
//         <Alert className="bg-red-50 border-red-200">
//           <AlertCircleIcon className="h-4 w-4 text-red-600" />
//           <AlertTitle className="text-red-800">Error</AlertTitle>
//           <AlertDescription className="text-red-700">
//             {submitError}
//           </AlertDescription>
//         </Alert>
//       )}

//       <div className="space-y-4">
//         {workforceLocations.map((workforce, index) => (
//           <div key={index} className="rounded-lg overflow-auto">
//             <div
//               className="flex items-center justify-between px-6 py-4 bg-[#d1cebb] cursor-pointer hover:bg-[#c5c2af] transition-colors"
//               onClick={() => toggleAccordion(index)}
//             >
//               <p className="font-semibold text-base text-neutral-900">
//                 Workforce Location {index + 1}
//               </p>

//               <div className="flex items-center gap-4">
//                 {workforceLocations.length > 1 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeWorkforce(index);
//                     }}
//                     className="text-red-500 hover:text-red-600 transition-colors p-1"
//                     disabled={isSubmitting}
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <ChevronDown
//                   size={20}
//                   className={`transition-transform text-black ${
//                     workforce.isOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </div>
//             </div>
//             {workforce.isOpen && (
//               <div className="px-6 pb-6 pt-2 space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Workforce Range</label>
//                     <Select
//                       value={workforce.workforceType || ""}
//                       onValueChange={(value) =>
//                         updateWorkforce(index, "workforceType", value)
//                       }
//                       disabled={isSubmitting}
//                     >
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="100-500" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {workforceRangeOptions.map((opt) => (
//                           <SelectItem key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Remote Work %</label>
//                     <Select
//                       value={workforce.workArrangementRemote || ""}
//                       onValueChange={(value) =>
//                         updateWorkforce(index, "workArrangementRemote", value)
//                       }
//                       disabled={isSubmitting}
//                     >
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="25%-50%" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {workArrangementOptions.map((opt) => (
//                           <SelectItem key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Country</label>
//                     <Select
//                       value={workforce.country || ""}
//                       onValueChange={(value) =>
//                         updateWorkforce(index, "country", value)
//                       }
//                       disabled={isSubmitting}
//                     >
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="Select country" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {countryOptions.map((c) => (
//                           <SelectItem key={c.isoCode} value={c.isoCode}>
//                             {c.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <FloatingInput
//                       type="number"
//                       placeholder="Square meters"
//                       size="big"
//                       value={workforce.squareMeters || ""}
//                       onChange={(value) =>
//                         updateWorkforce(index, "squareMeters", value)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
        
//         <div className="flex justify-end">
//           <button
//             onClick={addWorkforce}
//             disabled={isSubmitting}
//             className={clsx(
//               "rounded-lg bg-[#d1cebb] p-4 flex text-base font-medium text-black transition-colors",
//               isSubmitting
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:bg-[#c5c2af]"
//             )}
//           >
//             <span>+ Add another workforce location</span>
//           </button>
//         </div>
//       </div>

//       {/* Information Alert */}
//       <Alert>
//         <AlertCircleIcon />
//         <AlertTitle>Workforce Emissions</AlertTitle>
//         <AlertDescription>
//           <p className="mb-2">Emissions from employee digital and work-related activities</p>
//           <ul className="list-inside list-disc text-sm space-y-1">
//             <li>Includes energy use from laptops, monitors, and home office equipment</li>
//             <li>Covers emissions from internet usage, video calls, and cloud tools</li>
//             <li>Influenced by remote, hybrid, or office-based work models</li>
//             <li>May include commuting-related digital enablement impacts</li>
//             <li>Typically categorized as Scope 3 emissions</li>
//           </ul>
//         </AlertDescription>
//       </Alert>

//       {/* Action Buttons */}
//       <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
//         <button
//           onClick={onBack}
//           disabled={isSubmitting}
//           className={clsx(
//             "min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium transition-colors",
//             isSubmitting
//               ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
//               : "text-neutral-700 hover:bg-[#d1cebb]"
//           )}
//         >
//           Back
//         </button>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={handleSkipClick}
//             disabled={isSubmitting}
//             className={clsx(
//               "min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium transition-colors",
//               isSubmitting
//                 ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
//                 : "text-neutral-700 hover:bg-[#d1cebb]"
//             )}
//           >
//             Skip
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={!canProceed || isSubmitting}
//             className={clsx(
//               "min-w-[140px] rounded-lg px-8 py-3 text-base font-medium text-white transition-all flex items-center justify-center gap-2",
//               canProceed && !isSubmitting
//                 ? "bg-black hover:bg-neutral-800 cursor-pointer shadow-sm hover:shadow"
//                 : "bg-neutral-300 cursor-not-allowed"
//             )}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               "Continue"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
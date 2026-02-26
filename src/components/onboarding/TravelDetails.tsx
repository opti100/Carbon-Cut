// "use client";

// import React, { useState } from "react";
// import FloatingInput from "../ui/FloatingInput";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { AlertCircleIcon, ChevronDown, Trash2, Loader2, CheckCircle2 } from "lucide-react";
// import { TravelData, TravelItem } from "@/types/onboarding";
// import { onboardingApi } from "@/services/onboarding/onboarding";
// import clsx from "clsx";
// import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// interface Props {
//   data: TravelData;
//   onDataChange: (data: TravelData) => void;
//   onBack: () => void;
//   onNext: () => void;
//   onSkip?: () => void;
//   canProceed: boolean;
// }

// const travelTypeOptions = [
//   { label: "Flight", value: "flight" },
//   { label: "Train", value: "train" },
//   { label: "Car", value: "car" },
//   { label: "Bus", value: "bus" },
// ];

// const flightClassOptions = [
//   { label: "Economy", value: "economy" },
//   { label: "Premium Economy", value: "premium_economy" },
//   { label: "Business", value: "business" },
//   { label: "First Class", value: "first" },
// ];

// const domesticOptions = [
//   { label: "Domestic", value: "domestic" },
//   { label: "International", value: "international" },
// ];

// export default function TravellingDetails({
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

//   const travels = data.travels;

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmitError(null);
//     setSubmitSuccess(null);

//     try {
//       const response = await onboardingApi.submitTravel(data);
      
//       if (response.success) {
//         setSubmitSuccess(
//           response.message || 
//           `Successfully calculated ${response.data.total_emissions_kg.toFixed(2)} kg CO₂e for ${response.data.trips.length} trip(s)`
//         );
//         // Proceed to next step after short delay
//         setTimeout(() => {
//           onNext();
//         }, 1500);
//       } else {
//         throw new Error('Failed to submit travel data');
//       }
//     } catch (error: any) {
//       console.error('Error submitting travel data:', error);
//       setSubmitError(
//         error.error || 
//         error.message || 
//         'Failed to submit travel data. Please try again.'
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

//   const updateTravel = (
//     index: number,
//     key: keyof TravelItem,
//     value: any
//   ) => {
//     onDataChange({
//       travels: travels.map((item, i) =>
//         i === index ? { ...item, [key]: value } : item
//       ),
//     });
//     setSubmitError(null);
//     setSubmitSuccess(null);
//   };

//   const addTravel = () => {
//     onDataChange({
//       travels: [
//         ...travels.map((t) => ({ ...t, isOpen: false })),
//         { travel_type: "", isOpen: true },
//       ],
//     });
//   };

//   const removeTravel = (index: number) => {
//     if (travels.length <= 1) return;
//     onDataChange({
//       travels: travels.filter((_, i) => i !== index),
//     });
//   };

//   const toggleAccordion = (index: number) => {
//     onDataChange({
//       travels: travels.map((item, i) =>
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
//         {travels.map((travel, index) => (
//           <div key={index} className="rounded-lg overflow-auto">
//             <div
//               className="flex items-center justify-between px-6 py-4 cursor-pointer bg-[#d1cebb] hover:bg-[#c5c2af] transition-colors"
//               onClick={() => toggleAccordion(index)}
//             >
//               <p className="font-semibold text-base text-neutral-900">
//                 Travel {index + 1}
//                 {travel.travel_type && ` - ${travelTypeOptions.find(t => t.value === travel.travel_type)?.label || travel.travel_type}`}
//               </p>

//               <div className="flex items-center gap-4">
//                 {travels.length > 1 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeTravel(index);
//                     }}
//                     disabled={isSubmitting}
//                     className="text-red-500 hover:text-red-600 transition-colors p-1"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 )}
//                 <ChevronDown
//                   size={20}
//                   className={`transition-transform text-black ${
//                     travel.isOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </div>
//             </div>
//             {travel.isOpen && (
//               <div className="px-6 pb-6 pt-2 space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Travel type</label>
//                     <Select
//                       value={travel.travel_type}
//                       onValueChange={(val) =>
//                         updateTravel(index, "travel_type", val)
//                       }
//                       disabled={isSubmitting}
//                     >
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="Select travel type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {travelTypeOptions.map((opt) => (
//                           <SelectItem key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Travel Date</label>
//                     <FloatingInput
//                       placeholder="Travel Date"
//                       size="big"
//                       type="date"
//                       value={travel.travel_date || ""}
//                       onChange={(value) =>
//                         updateTravel(index, "travel_date", value)
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div className="space-y-2">
//                     <FloatingInput
//                       placeholder="Passenger Count"
//                       size="big"
//                       type="number"
//                       value={travel.passenger_count || ""}
//                       onChange={(value) =>
//                         updateTravel(index, "passenger_count", value)
//                       }
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <FloatingInput
//                       placeholder="Distance (km)"
//                       size="big"
//                       type="number"
//                       value={travel.distance_km || ""}
//                       onChange={(value) =>
//                         updateTravel(index, "distance_km", value)
//                       }
//                     />
//                   </div>
//                 </div>

//                 {travel.travel_type === "flight" && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">Flight Class</label>
//                       <Select
//                         value={travel.flight_class || ""}
//                         onValueChange={(val) =>
//                           updateTravel(index, "flight_class", val)
//                         }
//                         disabled={isSubmitting}
//                       >
//                         <SelectTrigger className="h-14">
//                           <SelectValue placeholder="Select flight class" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {flightClassOptions.map((opt) => (
//                             <SelectItem key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">Travel Scope</label>
//                       <Select
//                         value={travel.is_domestic || ""}
//                         onValueChange={(val) =>
//                           updateTravel(index, "is_domestic", val)
//                         }
//                         disabled={isSubmitting}
//                       >
//                         <SelectTrigger className="h-14">
//                           <SelectValue placeholder="Select travel scope" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {domesticOptions.map((opt) => (
//                             <SelectItem key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={addTravel}
//           disabled={isSubmitting}
//           className={clsx(
//             "rounded-lg bg-[#d1cebb] p-4 flex justify-center text-center items-center text-base font-medium text-black transition-colors",
//             isSubmitting
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-[#c5c2af]"
//           )}
//         >
//           <span>+ Add another travel segment</span>
//         </button>
//       </div>

//       {/* Information Alert */}
//       <Alert>
//         <AlertCircleIcon />
//         <AlertTitle>Travel-Related Emissions</AlertTitle>
//         <AlertDescription>
//           <p className="mb-2">Emissions from business and employee travel activities</p>
//           <ul className="list-inside list-disc text-sm space-y-1">
//             <li>Includes flights, trains, taxis, rental cars, and buses</li>
//             <li>One of the highest-impact emission sources per activity</li>
//             <li>Strongly influenced by travel frequency and distance</li>
//             <li>Flight class significantly affects per-passenger emissions</li>
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
//           {onSkip && (
//             <button
//               onClick={handleSkipClick}
//               disabled={isSubmitting}
//               className={clsx(
//                 "min-w-[140px] rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium transition-colors",
//                 isSubmitting
//                   ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
//                   : "text-neutral-700 hover:bg-[#d1cebb]"
//               )}
//             >
//               Skip
//             </button>
//           )}

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

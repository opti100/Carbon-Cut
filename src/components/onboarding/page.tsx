"use client";

import { useState } from "react";
import CloudProvider from "./CloudProvider";
import Cdn from "./Cdn";
import { StepProgress } from "./stepProgress";
import WorkforceEmissions from "./WorkforceEmissions";
import OnPrem from "./OnPrem";

const TOTAL_STEPS = 5;

export default function VTwoFlow() {
    const [step, setStep] = useState(1);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#fcfdf6]">
            <div className="flex w-full max-w-6xl  flex-col gap-8 rounded-xl p-8">

                {/* Progress bar */}
                <StepProgress
                    total={TOTAL_STEPS}
                    current={step}
                    onChange={setStep}
                />

                {/* Step content */}
                {step === 1 && <CloudProvider onNext={() => setStep(2)} />}

                {step === 2 && (
                    <Cdn
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}

                {step === 3 && (
                        <WorkforceEmissions
                            onBack={() => setStep(2)}
                            onNext={() => setStep(4)}                       />
                    )}
                
                {step === 4 && (
                    <OnPrem 
                        onBack={() => setStep(3)}
                        onNext={() => setStep(5)}
                    />
                )}
                {/* Placeholder for remaining steps */}
                {step > 2 && (
                    <div className="text-center">
                        {/* <p className="text-lg font-medium">Step {step}</p> */}
                        <div className="mt-4 flex justify-between">
                            <button
                                className="rounded-md border border-neutral-300 px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                                onClick={() => setStep(step - 1)}>Back</button>
                            <button
                                className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
                                onClick={() => setStep(step + 1)}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

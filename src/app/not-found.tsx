import React from "react";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">
          The page you’re looking for is under development
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          We’re currently working on something great.
        </p>
        <p className="text-lg text-orange-600 font-medium">
          Please check back soon.
        </p>
      </div>
    </div>
  );
}

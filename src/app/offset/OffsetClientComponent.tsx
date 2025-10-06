"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Leaf, ArrowRight, Globe, MapPin } from "lucide-react";
import { ComplianceMarketCountries } from "@/types/market";

interface User {
  userId: string;
  email: string;
  name: string;
}

interface OffsetClientComponentProps {
  user: User;
  hasMarketSelection: boolean;
}

const OffsetClientComponent: React.FC<OffsetClientComponentProps> = ({ user, hasMarketSelection }) => {
  const [selectedMarket, setSelectedMarket] = useState<"compliance" | "voluntary" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const marketParam = searchParams.get("market");
    if (marketParam === "compliance" || marketParam === "voluntary") {
      setSelectedMarket(marketParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (hasMarketSelection) {
      router.push("/dashboard");
    }
  }, [hasMarketSelection, router]);

  const updateMarketMutation = useMutation({
    mutationFn: async (market: "compliance" | "voluntary") => {
      const response = await fetch("/api/user/update-market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          market: market.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update market selection");
      }

      return response.json();
    },
    onSuccess: () => {
      if (selectedMarket === "voluntary") {
        router.push("/projects");
      }
    },
    onError: (error: Error) => {
      console.error("Error updating market selection:", error.message);
    },
  });

  const updateCountryMutation = useMutation({
    mutationFn: async (country: string) => {
      const response = await fetch("/api/user/update-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update country selection");
      }

      return response.json();
    },
    onSuccess: () => {
      router.push(`/projects`);
    },
    onError: (error: Error) => {
      console.error("Error updating country selection:", error.message);
    },
  });

  const handleMarketSelection = (market: "compliance" | "voluntary") => {
    setSelectedMarket(market);
    localStorage.setItem("selectedMarket", market);
    updateMarketMutation.mutate(market);
  };

  const handleCountrySelection = (country: string) => {
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", country);
  };

  const handleContinue = () => {
    if (selectedMarket === "compliance" && selectedCountry) {
      updateCountryMutation.mutate(selectedCountry);
    }
  };

  const complianceCountries = Object.entries(ComplianceMarketCountries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <BlurFade delay={0.1}>
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Carbon Offset Market
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the carbon offset market that best fits your organization&apos;s needs and compliance requirements.
            </p>
          </div>
        </BlurFade>

        <div className="max-w-4xl mx-auto">
          <BlurFade delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
              <Card
                className={`bg-white border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl ${
                  selectedMarket === "compliance"
                    ? "border-blue-500 ring-4 ring-blue-500/10 shadow-xl scale-105"
                    : "border-gray-200 hover:border-blue-300 hover:scale-102"
                }`}
                onClick={() => handleMarketSelection("compliance")}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div
                      className={`flex-shrink-0 p-3 md:p-4 rounded-2xl transition-colors ${
                        selectedMarket === "compliance" ? "bg-blue-100" : "bg-blue-50"
                      }`}
                    >
                      <Building2 className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Compliance Market</h3>
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-sm px-3 py-1">Regulated</Badge>
                      </div>
                      <p className="text-gray-600 text-base md:text-lg mb-4 leading-relaxed">
                        Government-regulated carbon credits for organizations with mandatory emission reduction targets under cap-and-trade systems.
                      </p>
                      {selectedMarket === "compliance" && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Compliance Market Selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`bg-white border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl ${
                  selectedMarket === "voluntary"
                    ? "border-green-500 ring-4 ring-green-500/10 shadow-xl scale-105"
                    : "border-gray-200 hover:border-green-300 hover:scale-102"
                }`}
                onClick={() => handleMarketSelection("voluntary")}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div
                      className={`flex-shrink-0 p-3 md:p-4 rounded-2xl transition-colors ${
                        selectedMarket === "voluntary" ? "bg-green-100" : "bg-green-50"
                      }`}
                    >
                      <Leaf className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Voluntary Market</h3>
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1">Flexible</Badge>
                      </div>
                      <p className="text-gray-600 text-base md:text-lg mb-4 leading-relaxed">
                        Market-driven carbon credits for voluntary sustainability commitments and corporate responsibility initiatives.
                      </p>
                      {selectedMarket === "voluntary" && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Voluntary Market Selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </BlurFade>

          {selectedMarket === "compliance" && (
            <BlurFade delay={0.3}>
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Select Your Country/Region</h2>
                      <p className="text-gray-600">Choose the compliance market for your region</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Select onValueChange={handleCountrySelection}>
                      <SelectTrigger className="w-full h-12 md:h-14 text-base md:text-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Select your country/region" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {complianceCountries.map(([key, value]) => (
                          <SelectItem key={key} value={key} className="text-base py-3">
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedCountry && (
                      <BlurFade delay={0.1}>
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <p className="text-blue-700 font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Selected Region: {ComplianceMarketCountries[selectedCountry as keyof typeof ComplianceMarketCountries]}
                          </p>
                        </div>

                        <Button
                          onClick={handleContinue}
                          className="w-full mt-6 h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-medium"
                        >
                          Continue to Compliance Market
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </BlurFade>
                    )}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffsetClientComponent;
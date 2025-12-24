"use client"

import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { ApiKeyService } from "@/services/apikey/apikey"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Copy } from "lucide-react"

interface ApiKeyStepProps {
    onNext: () => void
    sourceType?: "ads" | "web"  // NEW: Accept source type from parent
}

export default function ApiKeyStep({ onNext, sourceType = "web" }: ApiKeyStepProps) {
    const [isCreating, setIsCreating] = useState(false)

    // Fetch API keys filtered by source type
    const { data: apiKeysData, isLoading: isLoadingKeys, isError: isKeysError, refetch } = useQuery({
        queryKey: ["apiKeys", sourceType],
        queryFn: () => ApiKeyService.getApiKeys(sourceType),  
        staleTime: 30000,
    })

    // Get the latest API key of the specified type
    const latestApiKey = apiKeysData?.data?.api_keys?.[0]

    const { data: installationGuideData, isLoading: isLoadingGuide, isError: isGuideError } = useQuery({
        queryKey: ["installationGuide", latestApiKey?.id],
        queryFn: () => ApiKeyService.getInstallationGuide(latestApiKey?.id ?? ""),
        enabled: !!latestApiKey,
    })

    // Auto-create API key if none exists for this type
    useEffect(() => {
        const createKeyIfNeeded = async () => {
            if (!isLoadingKeys && !latestApiKey && !isCreating && !isKeysError) {
                try {
                    setIsCreating(true)
                    const keyName = sourceType === "ads" 
                        ? "Ads Tracking Key" 
                        : "Website Tracking Key"
                    
                    await ApiKeyService.createApiKey(keyName, "*", sourceType)
                    toast.success(`${sourceType === "ads" ? "Ads" : "Website"} API key created!`)
                    refetch()
                } catch (error) {
                    console.error("Failed to create API key:", error)
                    toast.error("Failed to create API key")
                } finally {
                    setIsCreating(false)
                }
            }
        }
        createKeyIfNeeded()
    }, [isLoadingKeys, latestApiKey, isCreating, isKeysError, sourceType, refetch])

    useEffect(() => {
        console.log("--- SDK Step Debug ---")
        console.log("Source Type:", sourceType)
        if (isLoadingKeys) {
            console.log("1. Loading API keys...")
        }
        if (isKeysError) {
            console.error("1. Error fetching API keys.")
        }
        if (apiKeysData) {
            console.log("1. API Keys Data Received:", apiKeysData)
            if (apiKeysData.data?.api_keys?.length > 0) {
                console.log("2. Found API Keys:", apiKeysData.data.api_keys)
                console.log("3. Latest API Key selected:", latestApiKey)
            } else {
                console.warn("2. No API keys found for source type:", sourceType)
            }
        }
    }, [apiKeysData, isLoadingKeys, isKeysError, latestApiKey, sourceType])

    useEffect(() => {
        if (latestApiKey) {
            if (isLoadingGuide) {
                console.log("4. Loading Installation Guide for key ID:", latestApiKey.id)
            }
            if (isGuideError) {
                console.error("4. Error fetching Installation Guide.")
            }
            if (installationGuideData) {
                console.log("5. Installation Guide Data Received:", installationGuideData)
            }
        }
    }, [installationGuideData, isLoadingGuide, isGuideError, latestApiKey])

    const installationGuide = installationGuideData?.data?.installation
    const scriptTag = installationGuide?.script_tag || ""

    const handleCopy = () => {
        if (!scriptTag) return
        navigator.clipboard.writeText(scriptTag)
        toast.success("Script copied to clipboard!")
    }

    const isLoading = isLoadingKeys || (!!latestApiKey && isLoadingGuide) || isCreating

    return (
        <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-900 mb-2">
                {sourceType === "ads" ? "Ads Tracking" : "Website/App"} SDK Script Tag
                <span className="ml-2 text-xs font-normal text-gray-500">
                    (Install this on your website)
                </span>
            </label>
            <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono min-h-[140px]">
                    {isLoading 
                        ? "Loading script..." 
                        : scriptTag || "Creating API key..."}
                </pre>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={isLoading || !scriptTag}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                >
                  <Copy />
                </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground space-y-2">
                <p>
                    <strong>Placement:</strong> Add this script in the{" "}
                    <code>&lt;head&gt;</code> or before closing{" "}
                    <code>&lt;/body&gt;</code>.
                </p>
                {sourceType === "ads" && (
                    <p className="text-orange-600">
                        <strong>Note:</strong> This script will track emissions from your ad campaigns with UTM parameters.
                    </p>
                )}
            </div>
            <Button
                onClick={onNext}
                disabled={isLoading || !scriptTag}
                className="mt-4 bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full z-10"
            >
                Continue
            </Button>
        </div>
    )
}
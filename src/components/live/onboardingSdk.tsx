"use client"

import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { ApiKeyService } from "@/services/apikey/apikey"
import { toast } from "sonner"
import { useEffect } from "react"

export default function ApiKeyStep({ onNext }: { onNext: () => void }) {
    const { data: apiKeysData, isLoading: isLoadingKeys, isError: isKeysError } = useQuery({
        queryKey: ["apiKeys"],
        queryFn: ApiKeyService.getApiKeys,
        staleTime: 30000,
    })

    const latestApiKey = apiKeysData?.data?.api_keys?.[0]

    const { data: installationGuideData, isLoading: isLoadingGuide, isError: isGuideError } = useQuery({
        queryKey: ["installationGuide", latestApiKey?.id],
        queryFn: () => ApiKeyService.getInstallationGuide(latestApiKey?.id ?? ""),
        enabled: !!latestApiKey, // IMPORTANT: This query only runs if `latestApiKey` exists
    })

    useEffect(() => {
        console.log("--- SDK Step Debug ---");
        if (isLoadingKeys) {
            console.log("1. Loading API keys...");
        }
        if (isKeysError) {
            console.error("1. Error fetching API keys.");
        }
        if (apiKeysData) {
            console.log("1. API Keys Data Received:", apiKeysData);
            if (apiKeysData.data?.api_keys?.length > 0) {
                console.log("2. Found API Keys:", apiKeysData.data.api_keys);
                console.log("3. Latest API Key selected:", latestApiKey);
            } else {
                console.warn("2. No API keys found in the response.");
            }
        }
    }, [apiKeysData, isLoadingKeys, isKeysError, latestApiKey]);

    useEffect(() => {
        if (latestApiKey) {
            if (isLoadingGuide) {
                console.log("4. Loading Installation Guide for key ID:", latestApiKey.id);
            }
            if (isGuideError) {
                console.error("4. Error fetching Installation Guide.");
            }
            if (installationGuideData) {
                console.log("5. Installation Guide Data Received:", installationGuideData);
            }
        }
    }, [installationGuideData, isLoadingGuide, isGuideError, latestApiKey]);

    const installationGuide = installationGuideData?.data?.installation
    const scriptTag = `<script 
  src="https://cdn.jsdelivr.net/gh/rishi-optiminastic/cc-cdn@main/dist/carboncut.min.js?v=2"
  data-token="cc_LeAktDLl23TQGdWHVkghUJSNOHYgzVh889dO9fRvYRTwv21Jx85bkrIk2Hu5Bemf"
  data-api-url="http://127.0.0.1:8000/api/v1/events/"
  data-debug="false"
  data-domain="*"
</script>`

    const handleCopy = () => {
        if (!scriptTag) return
        navigator.clipboard.writeText(scriptTag)
        toast.success("Script copied to clipboard!")
    }

    const isLoading = isLoadingKeys || (!!latestApiKey && isLoadingGuide)

    return (
        <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-900 mb-2">
                SDK Script Tag
                <span className="ml-2 text-xs font-normal text-gray-500">
                    (Install this on your website)
                </span>
            </label>
            <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono min-h-[140px]">
                    {isLoading ? "Loading script..." : scriptTag || "No API key found. Please create one first."}
                </pre>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={isLoading || !scriptTag}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                >
                    Copy
                </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground space-y-2">
                <p>
                    <strong>Placement:</strong> Add this script in the{" "}
                    <code>&lt;head&gt;</code> or before closing{" "}
                    <code>&lt;/body&gt;</code>.
                </p>
            </div>
            <Button
                onClick={onNext}
                // disabled={isLoading || !scriptTag}
                className="mt-4 bg-[#adff00] text-black hover:bg-[#adff00]/90 w-full"
            >
                Continue
            </Button>
        </div>
    )
}
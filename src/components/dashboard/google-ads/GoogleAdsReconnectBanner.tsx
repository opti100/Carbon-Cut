import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGoogleAdsTokenValidation } from "@/services/google-ads";
import { AlertCircle } from "lucide-react";

export const GoogleAdsReconnectBanner = () => {
  const { data: tokenStatus } = useGoogleAdsTokenValidation();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  if (!tokenStatus?.needs_reconnection) {
    return null;
  }

  const handleReconnect = () => {
    window.location.href = `${API_BASE_URL}/impressions/google/redirect/`;
  };

  return (
    <Alert
      variant="destructive"
      className="bg-[#fcfdf6] border-none flex items-center justify-center"
    >
      <AlertCircle className="h-4 w-4" />

      <AlertDescription className="flex w-full  items-center justify-between">
        <span className="">{tokenStatus.message}</span>

        <Button onClick={handleReconnect} variant="outline" size="sm">
          Reconnect Google Ads
        </Button>
      </AlertDescription>
    </Alert>
  );
};

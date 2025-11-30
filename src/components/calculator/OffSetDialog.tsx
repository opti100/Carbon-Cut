import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building2, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const OffsetDialog = () => {
  const [offsetDialogOpen, setOffsetDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<'compliance' | 'voluntary' | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleMarketSelection = (market: 'compliance' | 'voluntary') => {
    localStorage.setItem('selectedMarket', market);
    setSelectedMarket(market);
  };

  const handleClose = () => {
    setOffsetDialogOpen(false);
    setSelectedMarket(null);
  };

  const handleDialogTrigger = () => {
    if (!isAuthenticated) {
      router.push('/signup');
      return;
    }
    setOffsetDialogOpen(true);
  };

  return (
    <Dialog open={offsetDialogOpen} onOpenChange={setOffsetDialogOpen}>
      <Button 
        onClick={handleDialogTrigger}
        className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2.5 h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
      >
        Offset with CarbonCut
      </Button>
      
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-2xl p-4 sm:p-6">
        <DialogHeader className="px-0 sm:px-0">
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">
            Choose Your Carbon Offset Market
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm sm:text-base leading-relaxed text-center sm:text-left">
            Select the carbon offset market that best fits your organization&apos;s needs and compliance requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          {/* Compliance Market */}
          <Card
            className={`bg-white border-2 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md ${
              selectedMarket === 'compliance'
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleMarketSelection('compliance')}
          >
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 p-2 sm:p-3 bg-blue-50 rounded-xl">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                      Compliance Market
                    </h3>
                    <Badge className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1">
                      Regulated
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
                    Government-regulated carbon credits for organizations with mandatory emission reduction targets.
                  </p>
                  {selectedMarket === 'compliance' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium text-center sm:text-left">
                        ✓ Compliance Market Selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voluntary Market */}
          <Card
            className={`bg-white border-2 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md ${
              selectedMarket === 'voluntary'
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleMarketSelection('voluntary')}
          >
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 p-2 sm:p-3 bg-green-50 rounded-xl">
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                      Voluntary Market
                    </h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1">
                      Flexible
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 leading-relaxed">
                    Market-driven carbon credits for voluntary sustainability commitments.
                  </p>
                  {selectedMarket === 'voluntary' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium text-center sm:text-left">
                        ✓ Voluntary Market Selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedMarket}
            onClick={() => {
              handleClose();
              if (selectedMarket === 'compliance') {
                router.push(`/offset?market=${selectedMarket}`);
              } else {
                router.push(`/projects`);
              }
            }}
            className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            Continue to Offset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffsetDialog;
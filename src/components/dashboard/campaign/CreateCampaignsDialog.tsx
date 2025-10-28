"use client";

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Plus, X } from "lucide-react";
import { CreateCampaignData } from '@/types/campaign';
import { campaignApi } from '@/services/campaign/campaign';
import { Badge } from "@/components/ui/badge";
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const queryClient = useQueryClient();
  const { accounts, accountsLoading } = useGoogleAds();
  const [formData, setFormData] = useState<CreateCampaignData>({
    name: '',
    utm_params: [],
    account_id: '',
  });
  const [currentUtm, setCurrentUtm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: campaignApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onOpenChange(false);
      setFormData({
        name: '',
        utm_params: [],
        account_id: '',
      });
      setCurrentUtm('');
      setSelectedAccount(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) {
      alert('Please select a Google Ads account.');
      return;
    }
    createMutation.mutate({ ...formData, account_id: selectedAccount });
  };

  const updateField = (field: keyof CreateCampaignData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addUtmParam = () => {
    if (currentUtm.trim() && !formData.utm_params.includes(currentUtm.trim())) {
      setFormData(prev => ({
        ...prev,
        utm_params: [...prev.utm_params, currentUtm.trim()],
      }));
      setCurrentUtm('');
    }
  };

  const removeUtmParam = (utmToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      utm_params: prev.utm_params.filter(utm => utm !== utmToRemove),
    }));
  };

  const handleUtmKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUtmParam();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new campaign with UTM parameters to track performance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Summer 2024 Campaign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Google Ads Account *</Label>

              {accountsLoading ? (
                <Select disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Loading accounts..." />
                  </SelectTrigger>
                </Select>
              ) : accounts.length === 0 ? (
                <div className="p-3 border rounded-md bg-muted text-center">
                  <p className="text-sm text-gray-600">No Google Ads accounts found.</p>
                  <a
                    href="https://ads.google.com/home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm font-medium"
                  >
                    Create a Google Ads account
                  </a>
                </div>
              ) : (
                <>
                  <Select
                    onValueChange={(value) => setSelectedAccount(value)}
                    value={selectedAccount || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.currency}, {account.timezone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!selectedAccount && (
                    <p className="text-xs text-red-500">Please select a Google Ads account.</p>
                  )}
                </>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="utm_param">UTM Parameters</Label>
              <div className="flex gap-2">
                <Input
                  id="utm_param"
                  value={currentUtm}
                  onChange={(e) => setCurrentUtm(e.target.value)}
                  onKeyPress={handleUtmKeyPress}
                  placeholder="e.g., utm_campaign=summer_sale"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addUtmParam}
                  disabled={!currentUtm.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Press Enter or click + to add UTM parameter
              </p>
            </div>

            {formData.utm_params.length > 0 && (
              <div className="space-y-2">
                <Label>Added UTM Parameters ({formData.utm_params.length})</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50">
                  {formData.utm_params.map((utm, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <span className="text-xs font-mono">{utm}</span>
                      <button
                        type="button"
                        onClick={() => removeUtmParam(utm)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Common UTM Parameters:</p>
              <ul className="text-xs space-y-1 ml-4 list-disc">
                <li>utm_source=google</li>
                <li>utm_medium=cpc</li>
                <li>utm_campaign=summer_sale</li>
                <li>utm_content=banner_ad</li>
                <li>utm_term=running+shoes</li>
              </ul>
            </div>

            {createMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {createMutation.error.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !formData.name.trim() || !selectedAccount}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
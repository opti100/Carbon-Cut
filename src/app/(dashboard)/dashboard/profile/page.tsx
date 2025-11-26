"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  Loader2,
  Edit2,
  X,
  Key,
  Plus,
  Settings,
  Link2,
  FileText,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiKeysList } from "@/components/dashboard/api-key/ApiList";
import { CreateApiKeyDialog } from "@/components/dashboard/api-key/CreateAPIKeyDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { GoogleAdsConnectDialog } from "@/components/dashboard/google-ads/GoogleAdsConnectDialog";
import { ApiKeyService } from "@/services/apikey/apikey";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    companyName: user?.companyName || "",
  });

  // Check if user already has an API key
  const { data: apiKeysData } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const result = await ApiKeyService.getApiKeys();
      return result;
    },
    retry: 1,
    staleTime: 30000,
  });

  const apiKeys = apiKeysData?.data?.api_keys || [];
  const hasApiKey = apiKeys.length > 0;

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(
        "/auth/update-profile/",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
    },
  });

  // if (!isAuthenticated) {
  //   router.push("/login");
  //   return null;
  // }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      companyName: user?.companyName || "",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateKeyClick = () => {
    if (hasApiKey) {
      return; // Prevent opening if already has a key
    }
    setCreateKeyDialogOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-linear-to-br from-[#fcfdf6] via-[#f5f7e8] to-[#eef2d9]">
      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 sm:gap-8 m:gap-8">
            <Card className="border border-white/40 bg-white/30 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-[#080c04]">Profile Information</CardTitle>
                    <CardDescription className="text-[#6c5f31]">
                      Your personal details and contact information
                    </CardDescription>
                  </div>

                  {!isEditing && (
                    <Button
                      
                      onClick={() => setIsEditing(true)}
                      className="rounded px-4 sm:px-6 md:px-8 
             bg-[#b0ea1d] hover:bg-[#6c5f31] hover:text-white text-[#080c04]"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {updateProfileMutation.isSuccess && (
                  <Alert className="mb-6 bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-[#6c5f31]" />
                    <AlertDescription className="text-[#080c04]">
                      Profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {updateProfileMutation.error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>
                      {updateProfileMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                    <AvatarFallback className="text-white text-xl sm:text-2xl font-semibold bg-[#6c5f31]">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold mt-4 text-[#080c04]">
                        {user?.name || 'User'}
                      </span>
                      <span className="text-[#6c5f31]">{user?.email}</span>
                      <span className="flex text-[#6c5f31]"> <Image src="/verifiedTick.svg" alt="Verified" width={16} height={16} className="mr-1" />  Verified Account </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#080c04]">Email Address</Label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#edede2] border border-white/30 backdrop-blur-lg">
                          <Mail className="h-4 w-4 text-[#6c5f31]" />
                          <span className="break-all text-[#080c04]">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#080c04]">Full Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <User className="h-4 w-4 absolute left-3 text-[#6c5f31]" />
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="pl-10 border border-white/30 hover:border-white/50 bg-white/20 backdrop-blur-lg rounded-xl"
                              placeholder="Enter your name"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border-2 border-[#d1cebb] rounded-md bg-[#edede2]">
                            <User className="h-4 w-4 text-[#6c5f31]" />
                            <span className="break-all text-[#080c04]">
                              {user?.name || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-[#080c04]">Phone Number</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Phone className="h-4 w-4 absolute left-3 text-[#6c5f31]" />
                            <Input
                              id="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value,
                                })
                              }
                              className="pl-10 border border-white/30 hover:border-white/50 bg-white/20 backdrop-blur-lg rounded-xl"
                              placeholder="Enter phone number"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border-2 border-[#d1cebb] rounded-md bg-[#fcfdf6]">
                            <Phone className="h-4 w-4 text-[#6c5f31]" />
                            <span className="break-all text-[#080c04]">
                              {user?.phoneNumber || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-[#080c04]">Company Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Building2 className="h-4 w-4 absolute left-3 text-[#6c5f31]" />
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  companyName: e.target.value,
                                })
                              }
                              className="pl-10 border border-white/30 hover:border-white/50 bg-white/20 backdrop-blur-lg rounded-xl"
                              placeholder="Enter company name"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border-2 border-[#d1cebb] rounded-md bg-[#fcfdf6]">
                            <Building2 className="h-4 w-4 text-[#6c5f31]" />
                            <span className="break-all text-[#080c04]">
                              {user?.companyName || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-[#d1cebb]">
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="w-full sm:w-auto bg-[#b0ea1d]/90 hover:bg-[#6c5f31]/90 backdrop-blur-xl hover:text-white text-[#080c04] transition-all duration-300 rounded-xl shadow-lg hover:shadow-2xl border border-white/20"
                        >
                          {updateProfileMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={updateProfileMutation.isPending}
                          className="w-full sm:w-auto border border-white/40 hover:border-white/60 text-[#080c04] bg-white/30 backdrop-blur-lg transition-all duration-300 hover:shadow-lg rounded-xl"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>

              <div className="border-b w-[95%] mx-auto" />

              <CardHeader>
                <CardTitle className="text-[#080c04]">Account Details</CardTitle>
                <CardDescription className="text-[#6c5f31]">
                  Additional information about your account
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#6c5f31]" />
                    <div>
                      <p className="text-sm font-medium text-[#080c04]">
                        Member Since
                      </p>
                      <p className="text-sm text-[#6c5f31]">
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#6c5f31]" />
                    <div>
                      <p className="text-sm font-medium text-[#080c04]">
                        User ID
                      </p>
                      <p className="text-sm font-mono break-all text-[#6c5f31]">
                        {user?.id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="border-b w-[95%] mx-auto" />

              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-[#080c04]">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription className="text-[#6c5f31]">
                      Manage your API key for programmatic access
                    </CardDescription>
                  </div>
                  {hasApiKey ? (
                    <Button
                      disabled
                      className="rounded-xl cursor-not-allowed w-full sm:w-auto opacity-60 bg-white/30 backdrop-blur-lg text-[#6c5f31] border border-white/30"
                      title="You can only have one API key"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Limit Reached
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateKeyClick}
                      className="rounded-xl w-full sm:w-auto bg-[#b0ea1d]/90 hover:bg-[#6c5f31]/90 backdrop-blur-xl hover:text-white text-[#080c04] transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-2 overflow-x-auto">
                {hasApiKey && (
                  <Alert className="mb-4  backdrop-blur-lg bg-[#fcfdf6] border border-white/30 rounded-xl">
                    <AlertTriangle className=" h-4 w-4 text-[#6c5f31]" />
                    <AlertDescription className="text-[#080c04]">
                      <p className="font-medium">Single API Key Policy</p>
                      <p className="text-sm mt-1">
                        For security reasons, you can only have one active API key at a time. Delete your existing key to create a new one.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
                <ApiKeysList />
              </CardContent>
            </Card>

            <CreateApiKeyDialog
              open={createKeyDialogOpen}
              onOpenChange={setCreateKeyDialogOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
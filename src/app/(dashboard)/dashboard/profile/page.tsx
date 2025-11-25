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
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: '#fcfdf6' }}>
      <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle style={{ color: '#080c04' }}>Profile Information</CardTitle>
                    <CardDescription style={{ color: '#6c5f31' }}>
                      Your personal details and contact information
                    </CardDescription>
                  </div>
                 
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200"
                      style={{ borderColor: '#b0ea1d', color: '#080c04' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0db18')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {updateProfileMutation.isSuccess && (
                  <Alert className="mb-6" style={{ backgroundColor: 'rgba(176, 234, 29, 0.1)', borderColor: 'rgba(176, 234, 29, 0.5)' }}>
                    <CheckCircle className="h-4 w-4" style={{ color: '#b0ea1d' }} />
                    <AlertDescription style={{ color: '#080c04' }}>
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
                    <AvatarFallback className="text-white text-xl sm:text-2xl font-semibold" style={{ backgroundColor: '#b0ea1d' }}>
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold mt-4" style={{ color: '#080c04' }}>
                        {user?.name || 'User'}
                      </span>
                      <span style={{ color: '#6c5f31' }}>{user?.email}</span>
                      <span className="flex" style={{ color: '#b0ea1d' }}> <Image src="/verifiedTick.svg" alt="Verified" width={16} height={16} className="mr-1" />  Verified Account </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" style={{ color: '#080c04' }}>Email Address</Label>
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-md" style={{ backgroundColor: 'rgba(209, 206, 187, 0.2)', borderColor: '#d1cebb' }}>
                          <Mail className="h-4 w-4" style={{ color: '#6c5f31' }} />
                          <span className="break-all" style={{ color: '#080c04' }}>
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name" style={{ color: '#080c04' }}>Full Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <User className="h-4 w-4 absolute left-3" style={{ color: '#6c5f31' }} />
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="pl-10"
                              placeholder="Enter your name"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border rounded-md" style={{ backgroundColor: 'rgba(209, 206, 187, 0.2)', borderColor: '#d1cebb' }}>
                            <User className="h-4 w-4" style={{ color: '#6c5f31' }} />
                            <span className="break-all" style={{ color: '#080c04' }}>
                              {user?.name || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" style={{ color: '#080c04' }}>Phone Number</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Phone className="h-4 w-4 absolute left-3" style={{ color: '#6c5f31' }} />
                            <Input
                              id="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value,
                                })
                              }
                              className="pl-10"
                              placeholder="Enter phone number"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border rounded-md" style={{ backgroundColor: 'rgba(209, 206, 187, 0.2)', borderColor: '#d1cebb' }}>
                            <Phone className="h-4 w-4" style={{ color: '#6c5f31' }} />
                            <span className="break-all" style={{ color: '#080c04' }}>
                              {user?.phoneNumber || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName" style={{ color: '#080c04' }}>Company Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Building2 className="h-4 w-4 absolute left-3" style={{ color: '#6c5f31' }} />
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  companyName: e.target.value,
                                })
                              }
                              className="pl-10"
                              placeholder="Enter company name"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 border rounded-md" style={{ backgroundColor: 'rgba(209, 206, 187, 0.2)', borderColor: '#d1cebb' }}>
                            <Building2 className="h-4 w-4" style={{ color: '#6c5f31' }} />
                            <span className="break-all" style={{ color: '#080c04' }}>
                              {user?.companyName || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t" style={{ borderColor: '#d1cebb' }}>
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200"
                          style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                          onMouseEnter={(e) => !updateProfileMutation.isPending && (e.currentTarget.style.backgroundColor = '#F0db18')}
                          onMouseLeave={(e) => !updateProfileMutation.isPending && (e.currentTarget.style.backgroundColor = '#b0ea1d')}
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
                          className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200"
                          style={{ borderColor: '#d1cebb', color: '#080c04' }}
                          onMouseEnter={(e) => !updateProfileMutation.isPending && (e.currentTarget.style.backgroundColor = '#F0db18')}
                          onMouseLeave={(e) => !updateProfileMutation.isPending && (e.currentTarget.style.backgroundColor = 'transparent')}
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
                <CardTitle style={{ color: '#080c04' }}>Account Details</CardTitle>
                <CardDescription style={{ color: '#6c5f31' }}>
                  Additional information about your account
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" style={{ color: '#6c5f31' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#080c04' }}>
                        Member Since
                      </p>
                      <p className="text-sm" style={{ color: '#6c5f31' }}>
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" style={{ color: '#6c5f31' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#080c04' }}>
                        User ID
                      </p>
                      <p className="text-sm font-mono break-all" style={{ color: '#6c5f31' }}>
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
                    <CardTitle className="flex items-center gap-2" style={{ color: '#080c04' }}>
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription style={{ color: '#6c5f31' }}>
                      Manage your API key for programmatic access
                    </CardDescription>
                  </div>
                  {hasApiKey ? (
                    <Button
                      disabled
                      className="rounded cursor-not-allowed w-full sm:w-auto opacity-60"
                      style={{ backgroundColor: '#d1cebb', color: '#6c5f31' }}
                      title="You can only have one API key"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Limit Reached
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateKeyClick}
                      className="rounded w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200"
                      style={{ backgroundColor: '#b0ea1d', color: '#080c04' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0db18')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b0ea1d')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-2 overflow-x-auto">
                {hasApiKey && (
                  <Alert className="mb-4 border" style={{ backgroundColor: 'rgba(240, 219, 24, 0.1)', borderColor: 'rgba(240, 219, 24, 0.5)' }}>
                    <AlertTriangle className="h-4 w-4" style={{ color: '#F0db18' }} />
                    <AlertDescription style={{ color: '#080c04' }}>
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
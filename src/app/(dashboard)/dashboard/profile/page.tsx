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

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/update-profile/",
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

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Your personal details and contact information
                    </CardDescription>
                  </div>
                 
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {updateProfileMutation.isSuccess && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
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

                <div className="flex items-center gap-3 ">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-tertiary text-white text-2xl font-semibold">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <div className="flex flex-col items-start">
                      <span className=" font-semibold text-gray-900 mt-4">
                        {user?.name || 'User'}
                      </span>
                      <span className="text-gray-500">{user?.email}</span>
                      <span className="text-tertiary  flex"> <Image src="/verifiedTick.svg" alt="Verified" width={16} height={16} className="mr-1" />  Verified Account </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-md">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 break-all">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <User className="h-4 w-4 text-gray-400 absolute left-3" />
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
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-md">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 break-all">
                              {user?.name || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Phone className="h-4 w-4 text-gray-400 absolute left-3" />
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
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-md">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 break-all">
                              {user?.phoneNumber || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2 relative">
                            <Building2 className="h-4 w-4 text-gray-400 absolute left-3" />
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
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-md">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 break-all">
                              {user?.companyName || "Not set"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="w-full sm:w-auto"
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
                          className="w-full sm:w-auto"
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
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  Additional information about your account
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Member Since
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        User ID
                      </p>
                      <p className="text-sm text-gray-600 font-mono break-all">
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
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Manage your API key for programmatic access
                    </CardDescription>
                  </div>
                  {hasApiKey ? (
                    <Button
                      disabled
                      className="text-white bg-gray-400 rounded cursor-not-allowed w-full sm:w-auto"
                      title="You can only have one API key"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Limit Reached
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateKeyClick}
                      className="text-white bg-[#ff8904] hover:bg-[#ff8904]/90 rounded transition w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-2 overflow-x-auto">
                {hasApiKey && (
                  <Alert className="mb-4 bg-[#ff8904]/10 border-[#ff8904]/30">
                    <AlertTriangle className="h-4 w-4 text-[#ff8904]" />
                    <AlertDescription className="text-gray-800">
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
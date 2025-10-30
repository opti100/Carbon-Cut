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
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiKeysList } from "@/components/dashboard/api-key/ApiList";
import { CreateApiKeyDialog } from "@/components/dashboard/api-key/CreateAPIKeyDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

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

  const navigationItems = [
    { icon: User, label: "Profile", href: "/profile", active: true },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
    {
      icon: Link2,
      label: "Google Ads Integration",
      onClick: () => setConnectDialogOpen(true),
      active: false,
    },
    { icon: FileText, label: "My Reports", href: "/reports", active: false },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-72 ">
        <div className="p-6">
          <div className="font-bold mb-4 text-lg text-center md:text-left">
            Account Settings
          </div>
          <nav className="space-y-3">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.href) router.push(item.href);
                  else if (item.onClick) item.onClick();
                }}
                className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${item.active
                    ? "text-orange-500"
                    : ""
                  }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </button>
            ))}
            <div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
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

                <div  className="flex items-center gap-3 ">
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
                      Manage your API keys for programmatic access
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setCreateKeyDialogOpen(true)}
                    className="text-white bg-orange-600 rounded hover:bg-white hover:text-orange-500 transition w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-2 overflow-x-auto">
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

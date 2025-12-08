"use client"
import React, { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Loader2,
  Edit2,
  X,
  Key,
  Plus,
  Link2,
  LogOut,
  AlertTriangle,
} from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiKeysList } from "@/components/dashboard/api-key/ApiList"
import { CreateApiKeyDialog } from "@/components/dashboard/api-key/CreateAPIKeyDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { GoogleAdsConnectDialog } from "@/components/dashboard/google-ads/GoogleAdsConnectDialog"
import { ApiKeyService } from "@/services/apikey/apikey"
import { DashboardHeader } from "@/components/DashboardHeader"
import { useGoogleAds } from "@/contexts/GoogleAdsContext"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { status: googleAdsStatus } = useGoogleAds()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false)
  const [connectGoogleDialogOpen, setConnectGoogleDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    companyName: user?.companyName || "",
  })

  const { data: apiKeysData } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => ApiKeyService.getApiKeys(),
    retry: 1,
    staleTime: 30000,
  })

  const apiKeys = apiKeysData?.data?.api_keys || []
  const hasApiKey = apiKeys.length > 0

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/users/update/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update profile")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      setIsEditing(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      companyName: user?.companyName || "",
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleCreateKeyClick = () => {
    if (hasApiKey) return
    setCreateKeyDialogOpen(true)
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-background">
      {/* <DashboardHeader title="Profile & Settings" description="Manage your account and preferences" /> */}

      <div className="mx-auto max-w-4xl grid gap-8 mt-6">
        <Card className="bg-white rounded-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and contact information.</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {updateProfileMutation.isSuccess && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
              </Alert>
            )}
            {updateProfileMutation.error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{updateProfileMutation.error.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-semibold">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user?.name || "User"}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Form fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  ) : (
                    <p className="text-muted-foreground">{user?.name || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                  ) : (
                    <p className="text-muted-foreground">{user?.phoneNumber || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  {isEditing ? (
                    <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                  ) : (
                    <p className="text-muted-foreground">{user?.companyName || "Not set"}</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={updateProfileMutation.isPending}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card className="bg-white rounded-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" /> API Keys
              </CardTitle>
              <CardDescription>Manage your API key for programmatic access.</CardDescription>
            </div>
            {/* {hasApiKey ? (
              <Button disabled className="cursor-not-allowed w-full sm:w-auto" title="You can only have one API key">
                <AlertTriangle className="h-4 w-4 mr-2" /> Limit Reached
              </Button>
            ) : (
              
            )} */}
            <Button onClick={handleCreateKeyClick} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Create API Key
            </Button>
          </CardHeader>
          <CardContent>
            {/* {hasApiKey && (
              <Alert variant="default" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For security, only one active API key is allowed. To generate a new one, please delete the existing key.
                </AlertDescription>
              </Alert>
            )} */}
            <ApiKeysList />
          </CardContent>
        </Card>

        {/* Integrations Card */}
        <Card className="bg-white rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" /> Integrations
            </CardTitle>
            <CardDescription>Connect your account with third-party services.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Image src="/dsp/google-ads.svg" alt="Google Ads" width={40} height={40} />
                <div>
                  <p className="font-semibold">Google Ads</p>
                  <p className="text-sm text-muted-foreground">Sync your campaign data automatically.</p>
                </div>
              </div>
              {googleAdsStatus?.is_connected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected</span>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setConnectGoogleDialogOpen(true)}>
                  Connect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Management Card */}
        <Card className="bg-white rounded-md">
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Logout from your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateApiKeyDialog open={createKeyDialogOpen} onOpenChange={setCreateKeyDialogOpen} />
      <GoogleAdsConnectDialog open={connectGoogleDialogOpen} onOpenChange={setConnectGoogleDialogOpen} />
    </div>
  )
}
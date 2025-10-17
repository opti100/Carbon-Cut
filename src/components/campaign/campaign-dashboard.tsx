"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateCampaignForm } from "./create-campaign-form"
import { CampaignsList } from "./campaigns-list"

export function CampaignDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCampaignCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Carbon Campaign Manager</h1>
        <p className="text-muted-foreground">Track and manage your carbon emissions across marketing campaigns</p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignsList refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Set up a new carbon tracking campaign for your marketing initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCampaignForm onSuccess={handleCampaignCreated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

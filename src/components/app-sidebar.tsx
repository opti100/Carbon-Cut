"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Link2,
  Settings,
  User,
  LogOut,
  ChevronUp,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const items = [
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: LayoutDashboard,
  },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: Link2,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

const LOCAL_STORAGE_KEY = "googleAdsCustomerId";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    status,
    isLoading: statusLoading,
    accounts,
    accountsLoading,
    disconnect,
    switchAccount,
    fetchAccounts,
    checkConnection,
  } = useGoogleAds();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { state } = useSidebar();
  const [error, setError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const REFRESH_DELAY = 2000;
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    localStorage.getItem(LOCAL_STORAGE_KEY) || status?.customer_id || undefined
  );
  useEffect(() => {
    if (status?.customer_id) {
      setSelectedAccountId(status.customer_id);
      localStorage.setItem(LOCAL_STORAGE_KEY, status.customer_id);
    }
  }, [status?.customer_id]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleRefresh = React.useCallback(async () => {
    console.log("Refreshing accounts...");
    await fetchAccounts();
  }, [fetchAccounts]);

  const handleSwitchAccount = React.useCallback(async () => {
    if (!selectedAccountId || selectedAccountId === status?.customer_id) {
      return;
    }

    setIsSwitching(true);
    setError(null);

    try {
      console.log("Switching to account:", selectedAccountId);
      await switchAccount(selectedAccountId);
      console.log("Switch successful");

      localStorage.setItem(LOCAL_STORAGE_KEY, selectedAccountId);

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["googleAdsStatus"] });
        queryClient.invalidateQueries({ queryKey: ["googleAdsCampaigns"] });
        queryClient.invalidateQueries({ queryKey: ["google-ads-connection"] });
        checkConnection();
      }, REFRESH_DELAY);
    } catch (error) {
      console.error("❌ Switch failed:", error);
      setError(error instanceof Error ? error.message : "Failed to switch account");
    } finally {
      setIsSwitching(false);
    }
  }, [selectedAccountId, status?.customer_id, switchAccount, queryClient, checkConnection]);

  const currentAccount = accounts?.find((acc) => acc.id === selectedAccountId);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Switch Account</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={accountsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${accountsLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {accounts && accounts.length > 1 && (
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
              disabled={accountsLoading || isSwitching}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span>{account.name}</span>
                      {account.id === selectedAccountId && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedAccountId && selectedAccountId !== status?.customer_id && (
            <Button
              onClick={handleSwitchAccount}
              disabled={isSwitching}
              className="w-full"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch Account"
              )}
            </Button>
          )}
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Menu */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-600 text-white">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
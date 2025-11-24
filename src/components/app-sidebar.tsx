"use client";

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
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect, useCallback } from "react";
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
    switchAccount,
    fetchAccounts,
    checkConnection,
    isSwitchingAccount,
  } = useGoogleAds();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const REFRESH_DELAY = 1000;

  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LOCAL_STORAGE_KEY) || status?.customer_id || "";
    }
    return status?.customer_id || "";
  });

  useEffect(() => {
    if (status?.customer_id && status.customer_id !== selectedAccountId) {
      setSelectedAccountId(status.customer_id);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, status.customer_id);
      }
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

  const handleRefresh = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  const handleSwitchAccount = useCallback(async () => {
    if (!selectedAccountId || selectedAccountId === status?.customer_id) {
      return;
    }

    setError(null);

    try {
      await switchAccount(selectedAccountId);

      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, selectedAccountId);
      }

      setTimeout(() => {
        checkConnection();
      }, REFRESH_DELAY);
    } catch (error) {
      console.error("Switch failed:", error);
      setError(error instanceof Error ? error.message : "Failed to switch account");

      if (status?.customer_id) {
        setSelectedAccountId(status.customer_id);
      }
    }
  }, [selectedAccountId, status?.customer_id, switchAccount, checkConnection]);

  const showAccountSwitcher = status?.is_connected && accounts && accounts.length > 1;

  return (
    <Sidebar collapsible="icon" className="">
      {showAccountSwitcher && (
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Switch Account</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={accountsLoading}
                className="h-7 w-7 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${accountsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {accountsLoading ? (
              <Select disabled>
                <SelectTrigger className="bg-[#fcfdf6]">
                  <SelectValue placeholder="Loading accounts..." />
                </SelectTrigger>
              </Select>
            ) : accounts.length === 0 ? (
              <Select disabled>
                <SelectTrigger className="bg-[#fcfdf6]">
                  <SelectValue placeholder="No accounts found" />
                </SelectTrigger>
              </Select>
            ) : (
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
                disabled={accountsLoading || isSwitchingAccount}
              >
                <SelectTrigger className="bg-[#fcfdf6]">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent className="bg-[#fcfdf6]">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between gap-2 w-full  ">
                        <span className="truncate">{account.name}</span>
                        {account.id === status?.customer_id && (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedAccountId && selectedAccountId !== status?.customer_id && (
              <Button onClick={handleSwitchAccount} disabled={isSwitchingAccount} className="w-full" size="sm">
                {isSwitchingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Switching...
                  </>
                ) : (
                  "Switch Account"
                )}
              </Button>
            )}

            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
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

        {/* <SidebarGroup>
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
        </SidebarGroup> */}
      </SidebarContent>

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
                    <AvatarFallback className="bg-[#ff8904] text-white text-xs font-semibold">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
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
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
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

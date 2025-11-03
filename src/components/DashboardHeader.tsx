"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleAds } from "@/contexts/GoogleAdsContext";

interface DashboardHeaderProps {
    breadcrumbs: {
        label: string;
        href?: string;
    }[];
}

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
    const { user, isAuthenticated, logout } = useAuth();
    const { status, isLoading: adsLoading, connect, disconnect } = useGoogleAds();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
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
    return (
        <header className="flex h-16 shrink-0 items-center gap-2  bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConnectDialogOpen(true)}
                    className="hidden md:flex items-center gap-2"
                >
                    {adsLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Checking...</span>
                        </>
                    ) : status?.is_connected ? (
                        <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Google Ads</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-600">Connect Ads</span>
                        </>
                    )}
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-tertiary text-white text-sm font-semibold">
                            {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <Link href="/profile" className="flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-900">
                                {user?.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500">{user?.email}</span>
                        </Link>
                    </div>
                </Button>
            </div> */}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {index === breadcrumbs.length - 1 ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={breadcrumb.href || "#"}>
                                        {breadcrumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}
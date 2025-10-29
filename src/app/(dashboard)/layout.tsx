"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleAds } from '@/contexts/GoogleAdsContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  LayoutDashboard,
  Link2,
  FileText,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GoogleAdsConnectDialog } from '@/components/dashboard/google-ads/GoogleAdsConnectDialog';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { status, isLoading: adsLoading, connect, disconnect } = useGoogleAds();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Campaigns', href: '/campaigns', icon: LayoutDashboard },
    { name: 'Integrations', href: '/integrations', icon: Link2 },
  ];

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

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/campaigns" className="flex items-center gap-2">
                <Image
                  src="/ccLogo.svg"
                  alt="CarbonCut Logo"
                  width={128}
                  height={64}
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                />
              </Link>

              <nav className="hidden md:flex items-center gap-3">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
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
                    {/* <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Connected
                    </Badge> */}
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-600">Connect Ads</span>
                  </>
                )}
              </Button>

          
               
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm font-semibold">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <Link href="/profile" className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">
                          {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user?.email}
                        </span>
                      </Link>
                    </div>
                  </Button>
                
            

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setConnectDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {status?.is_connected ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      <span className="text-green-600">Google Ads Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
                      <span className="text-orange-600">Connect Google Ads</span>
                    </>
                  )}
                </Button>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <GoogleAdsConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        isConnected={status?.is_connected}
      // onConnect={connect}
      // onDisconnect={disconnect}
      />
    </div>
  );
}
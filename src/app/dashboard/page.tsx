"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Download, 
  Calendar, 
  Building2, 
  FileText, 
  TrendingUp, 
  LogOut, 
  User,
  Award,
  CreditCard,
  Eye,
  ExternalLink
} from "lucide-react";
import Link from 'next/link';

interface Report {
  id: string;
  userName: string;
  email: string;
  companyName: string;
  disclosureFormat: string;
  isCertified: boolean;
  certificationId?: string;
  totalEmissions: number;
  activityCount: number;
  reportPeriod?: string;
  paymentStatus: string;
  createdAt: string;
  pdfUrl?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  companyName?: string;
  phoneNumber?: string;
  reports: Report[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getFormatBadgeStyle = (format: string) => {
    switch (format) {
      case 'SECR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CSRD': return 'bg-green-100 text-green-800 border-green-200';
      case 'SEC': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CarbonCut</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your carbon footprint reports and track your environmental impact.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{user.reports.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certified Reports</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {user.reports.filter(r => r.isCertified).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Emissions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {user.reports.reduce((sum, r) => sum + r.totalEmissions, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">kg CO₂e</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Your Reports
              </CardTitle>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Report
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {user.reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-6">
                  Get started by creating your first carbon footprint report.
                </p>
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Your First Report
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {user.reports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {report.companyName} - {report.disclosureFormat} Report
                          </h3>
                          <Badge variant="outline" className={getFormatBadgeStyle(report.disclosureFormat)}>
                            {report.disclosureFormat}
                          </Badge>
                          {report.isCertified && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                              <Award className="h-3 w-3 mr-1" />
                              Certified
                            </Badge>
                          )}
                          <Badge variant="outline" className={getPaymentStatusStyle(report.paymentStatus)}>
                            {report.paymentStatus}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {report.totalEmissions.toFixed(2)} kg CO₂e
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {report.activityCount} activities
                          </div>
                          {report.certificationId && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {report.certificationId}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {report.pdfUrl ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(report.pdfUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <Download className="h-4 w-4 mr-1" />
                            Processing...
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, Award, Building2, Mail, Search, LogOut, User, Loader2, TrendingUp, Activity } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface UserReport {
  id: string;
  companyName: string;
  disclosureFormat: string;
  totalEmissions: number;
  activityCount: number;
  isCertified: boolean;
  certificationId?: string;
  paymentStatus: string;
  createdAt: string;
  pdfUrl?: string;
  activitiesCount: number;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  companyName: string;
  createdAt: string;
}

export default function UserDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchUserData = async (email?: string) => {
    const emailToUse = email || emailInput;
    
    if (!emailToUse || !emailToUse.trim()) {
      setError('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      console.log('Fetching data for email:', emailToUse);
      
      const response = await fetch(`/api/users/reports?email=${encodeURIComponent(emailToUse)}`);
      const result = await response.json();

      console.log('API Response:', result);

      if (result.success) {
        setUserData(result.user);
        setReports(result.reports);
        
        if (!isAuthenticated) {
          const url = new URL(window.location.href);
          url.searchParams.set('email', emailToUse);
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        setError(result.error || 'Failed to fetch user data');
        setUserData(null);
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
      setUserData(null);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserData({
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        companyName: user.companyName,
        createdAt: new Date().toISOString()
      });
      fetchUserReports(user.email);
    } else if (!authLoading) {
      const emailFromUrl = searchParams.get('email');
      if (emailFromUrl) {
        setEmailInput(emailFromUrl);
        fetchUserData(emailFromUrl);
      }
    }
  }, [isAuthenticated, user, authLoading, searchParams, fetchUserData]);

  const fetchUserReports = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      console.log('Fetching data for authenticated user:', email);
      
      const response = await fetch(`/api/users/reports?email=${encodeURIComponent(email)}`, {
        credentials: 'include'
      });
      const result = await response.json();

      console.log('API Response:', result);

      if (result.success) {
        setReports(result.reports);
      } else {
        setError(result.error || 'Failed to fetch user reports');
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching user reports:', err);
      setError('Failed to fetch user reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  

  const downloadReport = async (reportId: string) => {
    try {
      console.log('Downloading report:', reportId);
      
      const response = await fetch(`/api/reports/${reportId}/download`, {
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      
      if (contentType === 'application/pdf') {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'carbon_report.pdf';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('PDF downloaded successfully:', filename);
      } else {
        const result = await response.json();
        
        if (result.success && result.pdfUrl) {
          const link = document.createElement('a');
          link.href = result.pdfUrl;
          link.download = '';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert(result.error || 'Unable to download report. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.png"
                alt="Carbon Cut Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Carbon Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Track and manage your carbon footprint</p>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">{user?.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Email Search for Non-Authenticated Users */}
        {!isAuthenticated && (
          <Card className="mb-6 sm:mb-8 border-0 shadow-lg bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Your Reports</h2>
                <p className="text-gray-600">Enter your email to view your carbon footprint reports</p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full h-11 pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || !emailInput.trim()}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        View My Reports
                      </>
                    )}
                  </Button>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        {userData && (
          <div className="mb-6 sm:mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      {isAuthenticated ? `Welcome back, ${userData.name}!` : `Hello, ${userData.name}`}
                    </h2>
                    <p className="text-orange-100 text-sm sm:text-base">
                      Managing sustainability for <span className="font-semibold">{userData.companyName}</span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="bg-white/10 rounded-lg p-3 text-center min-w-[120px]">
                      <div className="text-2xl font-bold">{reports.length}</div>
                      <div className="text-xs text-orange-100">Total Reports</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center min-w-[120px]">
                      <div className="text-2xl font-bold">
                        {reports.reduce((sum, report) => sum + report.totalEmissions, 0).toFixed(0)}
                      </div>
                      <div className="text-xs text-orange-100">kg CO₂e Tracked</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Grid */}
        {(isAuthenticated || hasSearched) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-orange-500" />
                Your Carbon Reports
              </h3>
              {reports.length > 0 && (
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Create New Report
                  </Button>
                </Link>
              )}
            </div>

            {loading ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
                  <p className="text-gray-600 font-medium">Loading your reports...</p>
                </CardContent>
              </Card>
            ) : !userData ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Account Found</h4>
                  <p className="text-gray-600 mb-6">
                    We couldn&apos;t find an account with this email address.
                  </p>
                  <Link href="/">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Create Your First Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h4>
                  <p className="text-gray-600 mb-6">
                    Create your first carbon footprint report and start tracking your environmental impact.
                  </p>
                  <Link href="/">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Create Your First Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base mb-1">{report.companyName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs font-medium border-orange-200 text-orange-700">
                            {report.disclosureFormat}
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">Total Emissions</span>
                            </div>
                            <span className="font-bold text-gray-900">{report.totalEmissions.toFixed(2)} kg CO₂e</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">Activities</span>
                            </div>
                            <span className="font-bold text-gray-900">{report.activitiesCount}</span>
                          </div>
                        </div>

                        {/* Certification Status */}
                        {report.isCertified && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Award className="h-4 w-4 text-amber-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-amber-800">Certified Report</p>
                                {report.certificationId && (
                                  <p className="text-xs text-amber-600 font-mono">
                                    ID: {report.certificationId}
                                  </p>
                                )}
                              </div>
                              <Badge 
                                className={`text-xs ${
                                  report.paymentStatus === 'COMPLETED' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                }`}
                              >
                                {report.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Download Button */}
                        <Button
                          onClick={() => downloadReport(report.id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                          disabled={!report.pdfUrl}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {report.pdfUrl ? 'Download Report' : 'PDF Not Available'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section - Only show for non-authenticated users who haven't searched */}
        {!isAuthenticated && !hasSearched && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 mt-8">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to Carbon Dashboard
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Track, analyze, and reduce your company&apos;s carbon footprint with our comprehensive reporting tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium w-full sm:w-auto">
                    Login to Your Account
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full sm:w-auto">
                    Start Your First Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
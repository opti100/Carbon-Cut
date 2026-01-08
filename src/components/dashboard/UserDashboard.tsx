'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Download,
  FileText,
  Award,
  Building2,
  Mail,
  Search,
  LogOut,
  User,
  Loader2,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'

interface UserReport {
  id: string
  companyName: string
  disclosureFormat: string
  totalEmissions: number
  activityCount: number
  isCertified: boolean
  certificationId?: string
  paymentStatus: string
  createdAt: string
  pdfUrl?: string
  activitiesCount: number
}

interface UserData {
  id: string
  email: string
  name: string
  phoneNumber: string
  companyName: string
  createdAt: string
}

export default function UserDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [paymentVerifying, setPaymentVerifying] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')

  // Use ref to track if initial load has happened to prevent duplicate API calls
  const initialLoadDone = useRef(false)

  // Memoized fetch function to prevent infinite re-renders
  const fetchUserData = useCallback(async (email?: string) => {
    const emailToUse = email || emailInput

    if (!emailToUse || !emailToUse.trim()) {
      setError('Please enter an email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToUse)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      console.log('Fetching data for email:', emailToUse)

      const response = await fetch(
        `/api/users/reports?email=${encodeURIComponent(emailToUse)}`
      )
      const result = await response.json()

      console.log('API Response:', result)

      if (result.success) {
        setUserData(result.user)
        setReports(result.reports)

        if (!isAuthenticated) {
          const url = new URL(window.location.href)
          url.searchParams.set('email', emailToUse)
          window.history.replaceState({}, '', url.toString())
        }
      } else {
        setError(result.error || 'Failed to fetch user data')
        setUserData(null)
        setReports([])
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to fetch user data. Please try again.')
      setUserData(null)
      setReports([])
    } finally {
      setLoading(false)
    }
  }, []) // Remove emailInput from dependencies

  // Memoized fetch function for authenticated users
  const fetchUserReports = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      console.log('Fetching data for authenticated user:', email)

      const response = await fetch(
        `/api/users/reports?email=${encodeURIComponent(email)}`,
        {
          credentials: 'include',
        }
      )
      const result = await response.json()

      console.log('API Response:', result)

      if (result.success) {
        setReports(result.reports)
      } else {
        setError(result.error || 'Failed to fetch user reports')
        setReports([])
      }
    } catch (err) {
      console.error('Error fetching user reports:', err)
      setError('Failed to fetch user reports. Please try again.')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Verify payment status
  const verifyPayment = useCallback(
    async (sessionId: string) => {
      if (!sessionId) return

      setPaymentVerifying(true)
      setPaymentMessage('Verifying your payment...')

      try {
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const result = await response.json()

        if (result.success) {
          setPaymentMessage(
            '✅ Payment verified successfully! Your certified report will be emailed to you shortly.'
          )

          // Refresh reports to show updated status
          if (isAuthenticated && user?.email) {
            setTimeout(() => {
              fetchUserReports(user.email)
            }, 2000)
          } else {
            const emailFromUrl = searchParams.get('email')
            if (emailFromUrl) {
              setTimeout(() => {
                fetchUserData(emailFromUrl)
              }, 2000)
            }
          }
        } else {
          setPaymentMessage(
            `❌ Payment verification failed: ${result.message || 'Unknown error'}`
          )
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        setPaymentMessage('❌ Failed to verify payment. Please contact support.')
      } finally {
        setPaymentVerifying(false)

        // Clear message after 10 seconds
        setTimeout(() => {
          setPaymentMessage('')
        }, 10000)
      }
    },
    [fetchUserReports, fetchUserData, isAuthenticated, user, searchParams]
  )

  // Effect to handle initial data loading and payment verification
  useEffect(() => {
    // Prevent duplicate initial loads
    if (initialLoadDone.current) return

    const handleInitialLoad = async () => {
      // Check for payment success
      const paymentStatus = searchParams.get('payment')
      const sessionId = searchParams.get('session_id')

      if (paymentStatus === 'success' && sessionId) {
        console.log('Payment success detected, verifying...', sessionId)
        await verifyPayment(sessionId)
      } else if (paymentStatus === 'cancelled') {
        setPaymentMessage('⚠️ Payment was cancelled. You can try again from your report.')
        setTimeout(() => setPaymentMessage(''), 5000)
      }

      // Load user data
      if (isAuthenticated && user?.email) {
        setUserData({
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          companyName: user.companyName,
          createdAt: new Date().toISOString(),
        })
        await fetchUserReports(user.email)
      } else if (!authLoading && !isAuthenticated) {
        const emailFromUrl = searchParams.get('email')
        if (emailFromUrl) {
          setEmailInput(emailFromUrl)
          await fetchUserData(emailFromUrl)
        }
      }

      initialLoadDone.current = true
    }

    if (!authLoading) {
      handleInitialLoad()
    }
  }, [
    isAuthenticated,
    user,
    authLoading,
    searchParams,
    fetchUserReports,
    verifyPayment,
    fetchUserData,
  ])

  const downloadReport = async (reportId: string) => {
    try {
      console.log('Downloading report:', reportId)

      const response = await fetch(`/api/reports/${reportId}/download`, {
        credentials: 'include',
      })

      const contentType = response.headers.get('content-type')

      if (contentType === 'application/pdf') {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        const contentDisposition = response.headers.get('content-disposition')
        let filename = 'carbon_report.pdf'

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)

        console.log('PDF downloaded successfully:', filename)
      } else {
        const result = await response.json()

        if (result.success && result.pdfUrl) {
          const link = document.createElement('a')
          link.href = result.pdfUrl
          link.download = ''
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          if (result.requiresPayment) {
            alert(
              'This certified report requires payment completion before download. Please complete your payment first.'
            )
          } else {
            alert(result.error || 'Unable to download report. Please try again.')
          }
        }
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Error downloading report. Please try again.')
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUserData(emailInput)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Carbon Dashboard</h1>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Payment Status Message */}
        {(paymentVerifying || paymentMessage) && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              paymentMessage.includes('✅')
                ? 'bg-green-50 border-green-200'
                : paymentMessage.includes('❌')
                  ? 'bg-red-50 border-red-200'
                  : paymentMessage.includes('⚠️')
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {paymentVerifying ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              ) : paymentMessage.includes('✅') ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : paymentMessage.includes('❌') || paymentMessage.includes('⚠️') ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : null}
              <span
                className={`font-medium ${
                  paymentMessage.includes('✅')
                    ? 'text-green-800'
                    : paymentMessage.includes('❌')
                      ? 'text-red-800'
                      : paymentMessage.includes('⚠️')
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                }`}
              >
                {paymentVerifying ? 'Verifying payment...' : paymentMessage}
              </span>
            </div>
          </div>
        )}

        {/* Email Search for Non-Authenticated Users */}
        {!isAuthenticated && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Access Your Reports
                </h2>
                <p className="text-gray-600">
                  Enter your email to view your carbon Offset reports
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your.email@company.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !emailInput.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Welcome Section */}
        {userData && (
          <Card className="mb-8 bg-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Welcome, {userData.name}</h2>
                  <p className="text-orange-100">{userData.companyName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-sm text-orange-100">Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports Section */}
        {(isAuthenticated || hasSearched) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Your Reports</h3>
              {reports.length > 0 && (
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Create New Report
                  </Button>
                </Link>
              )}
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
                  <p className="text-gray-600">Loading your reports...</p>
                </CardContent>
              </Card>
            ) : !userData ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Account Found
                  </h4>
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
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Reports Yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Create your first carbon footprint report to get started.
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
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {report.companyName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {report.disclosureFormat}
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Emissions:</span>
                            <span className="font-medium">
                              {report.totalEmissions.toFixed(2)} kg CO₂e
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Activities:</span>
                            <span className="font-medium">{report.activitiesCount}</span>
                          </div>
                        </div>

                        {/* Certification Status */}
                        {report.isCertified && (
                          <div className="bg-amber-50 border border-amber-200 rounded p-3">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-800">
                                Certified
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ml-auto ${
                                  report.paymentStatus === 'COMPLETED'
                                    ? 'border-green-500 text-green-700 bg-green-50'
                                    : report.paymentStatus === 'PENDING'
                                      ? 'border-amber-500 text-amber-700 bg-amber-50'
                                      : 'border-red-500 text-red-700 bg-red-50'
                                }`}
                              >
                                {report.paymentStatus}
                              </Badge>
                            </div>
                            {report.certificationId && (
                              <p className="text-xs text-amber-600 mt-1 font-mono">
                                ID: {report.certificationId}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Download Button */}
                        <Button
                          onClick={() => downloadReport(report.id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={
                            !report.pdfUrl ||
                            (report.isCertified && report.paymentStatus !== 'COMPLETED')
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {!report.pdfUrl
                            ? 'PDF Not Available'
                            : report.isCertified && report.paymentStatus !== 'COMPLETED'
                              ? 'Payment Required'
                              : 'Download Report'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && !hasSearched && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to Carbon Dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Track and Offset your company&apos;s carbon footprint
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Login to Your Account
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Start Your First Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

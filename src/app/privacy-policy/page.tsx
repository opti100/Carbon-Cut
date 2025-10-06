"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, MapPin, Calendar, Clock, Users, Database, Lock, Globe, FileText } from 'lucide-react'

const page = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <FileText className="w-5 h-5" />,
      content: 'This Privacy Policy explains how CarbonCut collects, uses, shares, and protects personal and organizational data when you access our platform, including the CarbonCalculator, CarbonOffset marketplace, CarbonCut Certified (C3) Seal, APIs, dashboards, and related services.'
    },
    {
      id: 'data-collection',
      title: 'Data We Collect',
      icon: <Database className="w-5 h-5" />,
      subsections: [
        {
          title: 'Account & Contact Data',
          items: ['Name, organization, role, email, phone number, billing details', 'Login credentials and user preferences']
        },
        {
          title: 'Campaign & Usage Data',
          items: ['Campaign details: creatives, impressions, spend, targeting, placements', 'Platform usage metrics (features used, reports generated, integrations)', 'Aggregated, de-identified analytics across campaigns']
        },
        {
          title: 'Offset & Transaction Data',
          items: ['Credits purchased/retired via CarbonOffset', 'Registry identifiers (serial numbers, vintages, project references)', 'Smart contract entries (CarbonCut wallet only)', 'Tokenisation records (CarbonCut Tokens, if applicable)']
        },
        {
          title: 'Technical Data',
          items: ['Device and browser information, IP address, log files, cookies, in-app events', 'Security and fraud-prevention logs']
        },
        {
          title: 'Marketing Preferences',
          items: ['Channels you opt into (email, SMS, WhatsApp, in-app)', 'Partner-sharing preferences, personalization flags, and double opt-in records']
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Data',
      icon: <Users className="w-5 h-5" />,
      items: [
        'Deliver the Service, including emission calculations, offset purchases, certification, reporting, and tokenisation',
        'Generate compliance-ready reports (SECR, CSRD, SEC)',
        'Provide support, training, and customer success',
        'Improve methodologies, emission factors, and user experience',
        'Maintain transparency (e.g., smart contract logs, claims register)',
        'Conduct marketing and communications with your consent',
        'Comply with legal and regulatory obligations'
      ]
    },
    {
      id: 'legal-bases',
      title: 'Legal Bases for Processing',
      icon: <Shield className="w-5 h-5" />,
      items: [
        'Consent: for marketing communications and personalization',
        'Contractual necessity: to deliver the Service you signed up for',
        'Legitimate interests: to improve our platform, ensure security, and conduct analytics',
        'Legal obligations: to comply with climate disclosure, sanctions, export, and financial reporting laws'
      ]
    },
    {
      id: 'data-sharing',
      title: 'Sharing of Data',
      icon: <Globe className="w-5 h-5" />,
      items: [
        'Registries & project developers: Verra, Gold Standard, ACR, CAR, for credit verification and retirement',
        'Technology partners: hosting, analytics, and blockchain infrastructure providers',
        'Organisations under the same account: if multiple authorised users are linked to a single organisation\'s account',
        'Marketplace partners: only where you opt in to receive project updates',
        'Regulators & auditors: where disclosure is legally required'
      ]
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <Clock className="w-5 h-5" />,
      items: [
        'Account and campaign data: retained while your account is active + 24 months',
        'Offset/retirement records: retained permanently for transparency and audit',
        'Consent logs: retained while valid + 24 months',
        'Aggregated/anonymized analytics: retained indefinitely'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: <Users className="w-5 h-5" />,
      content: 'Depending on your jurisdiction (e.g., GDPR, UK GDPR, PDPA, CCPA), you may have rights to access, correct, or delete your data, restrict or object to processing, data portability, withdraw consent, and file a complaint with your local data protection authority.',
      contact: 'policy_carboncut@optiminastic.com'
    },
    {
      id: 'security',
      title: 'Security Measures',
      icon: <Lock className="w-5 h-5" />,
      items: [
        'ISO 27001-aligned technical and organizational controls',
        'Encrypted storage of sensitive data',
        'Strict authentication and credential security (multi-factor authentication where available)',
        'Regular audits, penetration tests, and monitoring'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Version 1.0
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Effective: 09 October 2025
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Optiminastic SG Pte Ltd
            </Badge>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to protecting your privacy and being transparent about how we handle your data.
          </p>
        </div>

        {/* Contact Card */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Privacy inquiries:</strong> policy_carboncut@optiminastic.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Legal:</strong> legal@optiminastic.com
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> 2 Venture DR, #19-21, Vision Exchange, Singapore 608526
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-green-100 p-2 rounded-lg">
                    {section.icon}
                  </div>
                  <span>{index + 1}. {section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {section.content && (
                  <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
                )}
                
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h4 className="font-semibold text-gray-900 mb-3">{subsection.title}</h4>
                        <ul className="space-y-2">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.contact && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Contact for requests:</strong> {section.contact}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Important Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Globe className="w-5 h-5" />
                International Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 text-sm">
                Data may be transferred to Singapore, the UK, the EU, the US, and other jurisdictions where our partners operate. We use Standard Contractual Clauses (SCCs) and other legally approved mechanisms for international transfers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Shield className="w-5 h-5" />
                Smart Contracts & Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 text-sm">
                Smart contracts record only successful offset retirements via the CarbonCut wallet. Records include transaction completion, credit volume, and project references. CarbonCut Tokens (CCTs) represent retired credits and follow proprietary tokenomics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-200 p-2 rounded-full">
                <FileText className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Important Notes</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• The Service is not directed to individuals under 18</li>
                  <li>• We may update this Privacy Policy from time to time</li>
                  <li>• Material changes will be communicated via email or in-app notifications</li>
                  <li>• Continued use constitutes acceptance of updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Last updated: October 09, 2025</p>
          <p className="mt-1">© 2025 Optiminastic SG Pte Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default page
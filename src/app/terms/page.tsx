'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Gavel,
  CreditCard,
  Lock,
  Globe,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react'

const page = () => {
  const sections = [
    {
      id: 'agreement',
      title: 'Agreement',
      icon: <FileText className="w-5 h-5" />,
      content:
        "These Terms govern your access to and use of CarbonCut's products and services, including our carbon-calculation platform, dashboards, APIs, and the offset marketplace. By creating an account, clicking accept, or using the Service, you agree to these Terms and our Privacy Policy.",
    },
    {
      id: 'accounts',
      title: 'Accounts & Eligibility',
      icon: <Users className="w-5 h-5" />,
      content:
        "You must be at least the age of majority in your jurisdiction and have the authority to bind your organization. Keep credentials confidential; you're responsible for activity under your account. Multiple users of an enterprise/agency must ensure compliance by all users.",
    },
    {
      id: 'service-scope',
      title: 'Service Scope',
      icon: <Globe className="w-5 h-5" />,
      subsections: [
        {
          title: 'CarbonCalculator - Carbon calculations',
          content:
            'CarbonCut provides modeled estimates of campaign-related greenhouse-gas emissions using emission factors, methodologies, and assumptions disclosed in-product or documentation. Results depend on your inputs and third-party data; they are not guarantees.',
        },
        {
          title: 'CarbonOffset - Offsets & certificates',
          content:
            'Offsets are supplied by third-party project developers and registries (e.g., VERRA, Gold Standard, ACR/CAR). CarbonCut operates a marketplace and may facilitate purchase/retirement. CarbonCut is not the issuer of credits and is not responsible for the performance of third-party projects.',
        },
        {
          title: 'C3 Seal - Certification & Seal',
          content:
            'Campaigns meeting measurement and/or offset criteria may display the CarbonCutCertified C3 seal, backed by blockchain verification. Certification applies only to the specific campaigns offset through CarbonCut or pays for the C3 Seals after calculation.',
        },
        {
          title: 'No legal/assurance service',
          content:
            'We do not provide legal, accounting, or verification services. If you need assurance (e.g., ISO/PAS claims), consider engaging an accredited third-party auditor.',
        },
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: <CheckCircle className="w-5 h-5" />,
      prohibited: [
        'Reverse engineer, scrape, or overload the Service',
        'Bypass technical controls',
        'Upload unlawful or infringing content',
        'Misrepresent calculated results or offset claims',
        'Use the Service to deceive consumers (e.g., greenwashing)',
      ],
    },
    {
      id: 'api-terms',
      title: 'API Terms',
      icon: <Globe className="w-5 h-5" />,
      items: [
        'Paid Service with Rate limits and fair use thresholds',
        'Security requirements (e.g., key rotation, storage)',
        'Attribution requirements (where applicable)',
        'Violation may result in suspension or termination of API access',
      ],
    },
    {
      id: 'your-data',
      title: 'Your Data',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        {
          title: 'Customer Content',
          content:
            'You own your inputs (campaign data, creatives, spend, etc.). You grant CarbonCut a license to process this data to provide and improve the Service, including aggregated, de-identified analytics.',
        },
        {
          title: 'Confidentiality',
          content:
            "Each party will protect the other's confidential information with reasonable care.",
        },
        {
          title: 'Privacy & security',
          content:
            'We process personal data per our Privacy Policy and maintain appropriate technical and organizational measures.',
        },
      ],
    },
    {
      id: 'claims',
      title: 'Claims & Communications',
      icon: <AlertTriangle className="w-5 h-5" />,
      subsections: [
        {
          title: 'Claims discipline',
          content:
            'If you publish claims (e.g., "carbon neutral campaign"), you must clearly disclose scopes/boundaries, the role of offsets, and provide supporting evidence (retirement serials, methodology, base year and CarbonCut Seal).',
        },
        {
          title: 'Compliance',
          content:
            'You are responsible for complying with applicable advertising/consumer-protection and anti-spam laws (e.g., UK CMA/ASA, EU UCPD/Green Claims Directive, U.S. FTC Green Guides, ISO 14021/14067, PAS 2060).',
        },
        {
          title: 'Use of CarbonCut name',
          content:
            'Don\'t imply CarbonCut "certified" your organization unless we offer and you complete a formal certification program by either purchasing the certification or buying the offset.',
        },
      ],
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contract Transparency',
      icon: <Lock className="w-5 h-5" />,
      subsections: [
        {
          title: 'When Smart Contracts Apply',
          content:
            'Smart contracts are introduced only after the successful retirement of carbon credits via the CarbonCut wallet.',
        },
        {
          title: 'Scope of Recording',
          content:
            'The smart contract records only: Confirmation of transaction completion, Volume of credits retired with essential Claim Record, Reference to the underlying project or registry.',
        },
        {
          title: 'Wallet Restriction',
          content:
            'Only the CarbonCut wallet interacts with the smart contract. User wallets are not connected directly, ensuring standardisation, simplicity, and reduced risk.',
        },
        {
          title: 'CarbonCut Tokens (CCTs)',
          content:
            'Following retirement, CarbonCut may tokenise a percentage of retired credits into CarbonCut Tokens (CCTs) for secondary trading. These tokens are separate from certification documentation and do not entitle double claiming.',
        },
      ],
    },
    {
      id: 'fees',
      title: 'Fees, Billing, Taxes, Refunds',
      icon: <CreditCard className="w-5 h-5" />,
      content:
        'Fees are as shown in the Service or an Order Form. Unless stated otherwise, fees are non-refundable; taxes are your responsibility. Late payments may incur interest and/or suspension.',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Shield className="w-5 h-5" />,
      content:
        'The Service, software, methodologies, and content are owned by CarbonCut and its licensors - Optiminastic SG PTE LTD. Except for your limited right to use the Service, no IP rights are transferred. Agencies/consultants may export CarbonCut reports for client deliverables with attribution.',
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <XCircle className="w-5 h-5" />,
      items: [
        'Neither party is liable for indirect or consequential damages',
        "CarbonCut's total liability is capped at amounts paid in 12 months (or USD 1,000 if no fees paid)",
        'CarbonCut is not liable for third-party project performance, registry errors, or regulatory rejection',
        'Nothing limits liability for fraud, willful misconduct, or amounts that cannot be limited by law',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law & Disputes',
      icon: <Gavel className="w-5 h-5" />,
      content:
        'These Terms are governed by the laws of the Republic of Singapore. Singapore courts have exclusive jurisdiction. Parties will attempt good faith resolution before litigation and may agree to mediation or arbitration under SIAC rules.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
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
            Please read these terms carefully. They govern your use of
            CarbonCuts&apos;services and form a legal agreement between you and us.
          </p>
        </div>

        {/* Contact Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Legal notices:</strong> legal@optiminastic.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Privacy inquiries:</strong> policy_carboncut@optiminastic.com
                </p>
                <p className="text-gray-700">
                  <strong>Postal:</strong> 2 Venture DR, #19-21, Vision Exchange,
                  Singapore 908526
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className="border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-blue-100 p-2 rounded-lg">{section.icon}</div>
                  <span>
                    {index + 1}. {section.title}
                  </span>
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
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.prohibited && (
                  <div>
                    <p className="text-gray-700 mb-3">You will not:</p>
                    <ul className="space-y-2">
                      {section.prohibited.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-3 italic">
                      We may suspend accounts for violations.
                    </p>
                  </div>
                )}

                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {subsection.title}
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertTriangle className="w-5 h-5" />
                Warranties & Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 text-sm">
                The Service is provided &quot;as is&quot;. We disclaim implied warranties
                (merchantability, fitness for purpose, non-infringement). We do not
                warrant that calculations or offsets will achieve any regulatory or
                certification outcome.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5" />
                Service Level Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 text-sm">
                Enterprise customers may request an SLA covering uptime commitments,
                service credits and support escalation. Unless separately agreed, the
                Service is provided &quot;as is&quot;.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance & Export Controls */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Globe className="w-5 h-5" />
              Export, Sanctions, Anti-Corruption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 text-sm">
              You will comply with applicable export controls and sanctions and will not
              use the Service in violation of anti-bribery/anti-corruption laws.
            </p>
          </CardContent>
        </Card>

        {/* Termination & Survival */}
        <Card className="mt-8 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-200 p-2 rounded-full">
                <Clock className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Term, Suspension, Termination
                </h3>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>• Terms continue while you use the Service</li>
                  <li>• We may suspend or terminate for material breach</li>
                  <li>• You may terminate by closing your account</li>
                  <li>
                    • Certain clauses survive termination (confidentiality, IP, liability,
                    etc.)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes Notice */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-200 p-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Changes to Terms</h3>
                <p className="text-yellow-800 text-sm">
                  We may update these Terms from time to time. If changes are material,
                  we&apos;ll notify you (e.g., email or in-app). Continued use after the
                  effective date constitutes acceptance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Last updated: October 09, 2025</p>
          <p className="mt-1">© 2025 Optiminastic SG Pte Ltd. All rights reserved.</p>
          <p className="mt-2 text-xs">
            These Terms (plus any Order Form and Privacy Policy) are the entire agreement
            and supersede prior understandings.
          </p>
        </div>
      </div>
    </div>
  )
}

export default page

'use client'
import React from 'react'
import { ProjectDTO } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlurFade } from '@/components/ui/blur-fade'
import {
  MapPin,
  Calendar,
  Building2,
  Leaf,
  TrendingUp,
  Users,
  Shield,
  ExternalLink,
  Globe,
  FileText,
  Award,
  TreePine,
  Factory,
  ChevronRight,
  DollarSign,
} from 'lucide-react'

interface ProjectDetailsProps {
  project: ProjectDTO
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <BlurFade delay={0.1}>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {project.name}
                  </h1>
                  <Badge variant="outline" className="text-sm">
                    {project.external_reference_id}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{project.developer}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    <Leaf className="h-3 w-3 mr-1" />
                    {project.project_type || 'Carbon Project'}
                  </Badge>
                  <Badge
                    variant={
                      project.project_status === 'Crediting' ? 'default' : 'outline'
                    }
                  >
                    {project.project_status}
                  </Badge>
                  {project.standard && (
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      {project.standard}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{project.country || project.region}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Vintage {project.vintage_year}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Purchase Credits
                </Button>
                {project.project_website && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.project_website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Project Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </BlurFade>

      {/* Credits Overview */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {project.available_credits.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Available Credits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {project.issued_credits.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Issued</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {project.retired_credits.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Retired Credits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">
                  {project.price_per_credit_usd
                    ? `$${project.price_per_credit_usd.toFixed(2)}`
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Price per Credit</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {project.description && (
            <BlurFade delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Technical Details */}
          <BlurFade delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Technical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Methodology</p>
                    <p className="font-medium">{project.methodology || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Verification Body</p>
                    <p className="font-medium">{project.verification_body || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Verification</p>
                    <p className="font-medium">
                      {formatDate(project.last_verification_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monitoring Frequency</p>
                    <p className="font-medium">{project.monitoring_frequency || 'N/A'}</p>
                  </div>
                </div>

                {project.baseline_scenario && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Baseline Scenario</p>
                    <p className="text-gray-700">{project.baseline_scenario}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          {/* Impact Metrics */}
          <BlurFade delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle>Impact & Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.annual_emission_reductions && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Annual Reductions</p>
                      <p className="font-medium text-green-600">
                        {project.annual_emission_reductions.toLocaleString()} tCO2e/year
                      </p>
                    </div>
                  )}
                  {project.total_estimated_reductions && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Estimated Reductions
                      </p>
                      <p className="font-medium text-green-600">
                        {project.total_estimated_reductions.toLocaleString()} tCO2e
                      </p>
                    </div>
                  )}
                  {project.project_area_hectares && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Project Area</p>
                      <p className="font-medium">
                        {project.project_area_hectares.toLocaleString()} hectares
                      </p>
                    </div>
                  )}
                  {project.capacity_mw && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Capacity</p>
                      <p className="font-medium">{project.capacity_mw} MW</p>
                    </div>
                  )}
                  {project.communities_impacted && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Communities Impacted</p>
                      <p className="font-medium">
                        {project.communities_impacted.toLocaleString()} people
                      </p>
                    </div>
                  )}
                  {project.jobs_created && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Jobs Created</p>
                      <p className="font-medium">{project.jobs_created} jobs</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SDGs */}
          {project.sdg_contributions.length > 0 && (
            <BlurFade delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UN SDGs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.sdg_contributions.map((sdg) => (
                      <Badge key={sdg} variant="outline" className="text-sm">
                        SDG {sdg}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Co-benefits */}
          {project.co_benefits.length > 0 && (
            <BlurFade delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Co-benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.co_benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Project Timeline */}
          <BlurFade delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Project Start</p>
                  <p className="font-medium">{formatDate(project.project_start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="font-medium">{formatDate(project.registration_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crediting Period</p>
                  <p className="font-medium">
                    {formatDate(project.crediting_period_start)} -{' '}
                    {formatDate(project.crediting_period_end)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Documents */}
          {Object.keys(project.documents).length > 0 && (
            <BlurFade delay={0.6}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(project.documents).map(([type, url]) => (
                      <Button
                        key={type}
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full"
                        asChild
                      >
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          {type}
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails

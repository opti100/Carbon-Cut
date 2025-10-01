"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProjects } from '@/utils/api';
import { ProjectDTO } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BlurFade } from '@/components/ui/blur-fade';
import { 
  MapPin, 
  Leaf, 
  TrendingUp, 
  Search,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const router = useRouter();

  const { data: projects, isLoading, isError, error } = useQuery<ProjectDTO[]>({
    queryKey: ['projects'],
    queryFn: fetchAllProjects,
    staleTime: 5 * 60 * 1000,
  });

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.developer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !filterCountry || project.country === filterCountry;
    const matchesType = !filterType || project.project_type === filterType;
    
    return matchesSearch && matchesCountry && matchesType;
  }) || [];

  const uniqueCountries = [...new Set(projects?.map(p => p.country).filter(Boolean))];
  const uniqueTypes = [...new Set(projects?.map(p => p.project_type).filter(Boolean))];

  const ProjectCard = ({ project }: { project: ProjectDTO }) => (
    <BlurFade delay={0.1}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900">
              {project.name}
            </CardTitle>
            <Badge variant="outline" className="flex-shrink-0 text-xs">
              {project.external_reference_id}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 font-medium">{project.developer}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{project.country || project.region}</span>
            </div>

            {/* Project Type */}
            {project.project_type && (
              <Badge variant="secondary" className="text-xs w-fit">
                <Leaf className="h-3 w-3 mr-1" />
                {project.project_type}
              </Badge>
            )}

            {/* Credits Info - Simplified */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">
                  {project.available_credits.toLocaleString()} credits
                </span>
              </div>
              {project.price_per_credit_usd && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-blue-600">
                    ${project.price_per_credit_usd.toFixed(2)}/credit
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push(`/projects/${project.external_reference_id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <TrendingUp className="h-4 w-4 mr-1" />
                Purchase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-72">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">
              Error loading projects: {error?.message || 'Unknown error'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlurFade delay={0.1}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Offset Projects
          </h1>
          <p className="text-gray-600">
            Browse verified carbon credits from projects worldwide
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="mb-6">
          <div className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Results Count */}
      <BlurFade delay={0.3}>
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects?.length || 0} projects
          </p>
        </div>
      </BlurFade>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.external_reference_id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <BlurFade delay={0.4}>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">
                No projects found matching your criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterCountry('');
                  setFilterType('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </BlurFade>
      )}
    </div>
  );
};

export default ProjectsPage;
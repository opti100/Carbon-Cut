'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, MapPin, Grid3x3, List, Search } from 'lucide-react';
import { useProjectDetails, useProjects } from '@/utils/projects/projectHooks';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/calculator/Header';
import PreFooter from '@/components/main/PreFooter';
import Footer from '@/components/main/Footer';
import Image from 'next/image';

const ProjectsPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuth();

  const { data: projects, isLoading, error } = useProjects();

  const {
    data: projectDetails,
    isLoading: isLoadingDetails
  } = useProjectDetails(selectedProjectId || '', auth.user?.id || '');

  const handleViewDetails = (projectId: string) => {
    console.log("Selected Project ID:", projectId);
    setSelectedProjectId(projectId);
  };

  const formatCredits = (credits: string) => {
    return new Intl.NumberFormat().format(parseInt(credits));
  };

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading projects: {error.message}</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <h1 className="text-3xl mt-20 font-bold mb-8">Carbon Offset Projects</h1>

        {/* Search and View Controls */}
        <div className="flex items-center justify-between mb-6 gap-4">
          {/* Search Bar - Left Side */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, developer, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle Buttons - Right Side */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('card')}
              className={
                viewMode === 'card'
                  ? 'bg-orange-500 text-white hover:bg-orange-400 border-orange-500'
                  : 'bg-white text-black hover:bg-gray-100'
              }
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className={
                viewMode === 'list'
                  ? 'bg-orange-500 text-white hover:bg-orange-400 border-orange-500'
                  : 'bg-white text-black hover:bg-gray-100'
              }
            >
              <List className="w-4 h-4 mr-2" />
              
            </Button>
          </div>

        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredProjects?.map((project) => (
              <div
                key={project.id}
                className="bg-white  overflow-hidden  flex flex-col cursor-pointer"
                onClick={() => handleViewDetails(project.id)}
              >
                {/* 🖼️ Square Image Section */}
                <div className="relative aspect-square w-full">
                  <Image
                    src="/auth-hero.jpg"
                    alt={project.name}
                    fill
                    className="object-cover rounded-md"
                  />

                  {/* 🔖 Overlay Badges */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100">
                      {project.registry}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/95 backdrop-blur-sm border border-gray-200"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {project.region}
                    </Badge>
                  </div>
                </div>

                {/* 📄 Content Section */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
                      {project.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                      {project.developer}
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Available Credits:</span>
                        <span className="font-semibold text-green-600">
                          {formatCredits(project.available_credits)} tCO₂e
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Issued:</span>
                        <span className="font-medium text-gray-700">
                          {formatCredits(project.issued_credits)} tCO₂e
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}




        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
              <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-600">
                <div className="col-span-4">Project Name</div>
                <div className="col-span-2">Proponent</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">GHG Program</div>
                <div className="col-span-1">Methodology</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>

            {/* Table Rows */}
            {filteredProjects?.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow border border-gray-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Project Name with Image */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        <Image
                          src="/auth-hero.jpg" width={30} height={30}
                          alt={project.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {project.name}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-gray-500">ID: {project.id}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {project.status || 'Under development'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Proponent */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-blue-700">
                            {project.developer?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <span className="text-sm truncate">{project.developer}</span>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-1">
                      <Badge variant="secondary" className="text-xs">
                        {project.type || 'Avoidance'}
                      </Badge>
                    </div>

                    {/* GHG Program */}
                    <div className="col-span-2">
                      <span className="text-sm">{project.registry}</span>
                    </div>

                    {/* Methodology */}
                    <div className="col-span-1">
                      <span className="text-sm">{project.methodology || 'ACM002'}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(project.id)}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={project.registry_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Registry
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredProjects?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found matching your search.</p>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProjectId && projectDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {projectDetails.project.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProjectId(null)}
                  className="text-2xl hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  {projectDetails.project.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Developer:</span>
                    <p>{projectDetails.project.developer}</p>
                  </div>
                  <div>
                    <span className="font-medium">Registry:</span>
                    <p>{projectDetails.project.registry}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="bg-green-500 hover:bg-green-600">
                    <a
                      href={projectDetails.registry_redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Registry
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href={projectDetails.project.documents.project_document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Project Document
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <PreFooter />
      <Footer />
    </div>
  );
};

export default ProjectsPage;
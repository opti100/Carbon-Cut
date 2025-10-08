'use client';

import * as React from 'react';
import { useState } from 'react';
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
              <Grid3x3 className="w-4 h-4 " />

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
              <List className="w-4 h-4 " />

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
                  <div className="absolute top-3 left-3 w-20">
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
                <div className="col-span-2">Developer</div>
                <div className="col-span-2">Registry</div>
                <div className="col-span-2">Available Credits</div>
                <div className="col-span-2">Total Issued</div>
              </div>
            </div>

            {/* Table Rows */}
            {filteredProjects?.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                onClick={() => handleViewDetails(project.id)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Project Name with Image */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        <Image
                          src="/auth-hero.jpg" width={48} height={48}
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
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            <MapPin className="h-3 w-3 mr-1" />
                            {project.region}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Developer */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{project.developer}</span>
                    </div>

                    {/* Registry */}
                    <div className="col-span-2">
                      <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100">
                        {project.registry}
                      </Badge>
                    </div>

                    {/* Available Credits */}
                    <div className="col-span-2">
                      <span className="font-semibold text-green-600">
                        {formatCredits(project.available_credits)} tCO₂e
                      </span>
                    </div>

                    {/* Total Issued */}
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">
                        {formatCredits(project.issued_credits)} tCO₂e
                      </span>
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="flex w-full max-w-5xl h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
      
      {/* LEFT SIDE — Image (40%) */}
      <div className="w-[40%] relative hidden md:block">
        <Image
          src="/hero2.jpg"
          alt="Project image"
          fill
          className="object-cover h-full w-full"
        />
      </div>

      {/* RIGHT SIDE — Details (60%) */}
      <div className="w-full md:w-[60%] flex flex-col justify-between px-10 py-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {projectDetails.project.name}
          </h2>
          <button
            onClick={() => setSelectedProjectId(null)}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Each Info Row */}
        <div className="space-y-5">
          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-gray-500">Region</span>
            <p className="text-gray-900 font-semibold">
              {projectDetails.project.region || "N/A"}
            </p>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-gray-500">Developer</span>
            <p className="text-gray-900 font-semibold">
              {projectDetails.project.developer || "N/A"}
            </p>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-gray-500">Registry</span>
            <p className="text-gray-900 font-semibold">
              {projectDetails.project.registry || "N/A"}
            </p>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-gray-500">Available Credits</span>
            <p className="text-gray-900 font-semibold">
              {formatCredits(projectDetails.project.available_credits)} tCO₂e
            </p>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-sm font-medium text-gray-500">Issued Credits</span>
            <p className="text-gray-900 font-semibold">
              {formatCredits(projectDetails.project.issued_credits)} tCO₂e
            </p>
          </div>

          {/* Description */}
          <div className="border-b pb-4">
            <span className="block text-sm font-medium text-gray-500 mb-1">Description</span>
            <p className="text-gray-700 leading-relaxed">
              {projectDetails.project.description}
            </p>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-3 pt-6">
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <a
              href={projectDetails.registry_redirect_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Registry
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>

          <Button
            variant="outline"
            asChild
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
          >
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
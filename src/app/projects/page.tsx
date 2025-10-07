'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, MapPin } from 'lucide-react';
import { useProjectDetails, useProjects } from '@/utils/projects/projectHooks';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/calculator/Header';
import PreFooter from '@/components/main/PreFooter';
import Footer from '@/components/main/Footer';

const ProjectsPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const auth = useAuth() 

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

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading projects: {error.message}</div>;
  }

  return (
    <div>
    <div className="container mx-auto px-4 py-8">
      <Header/>
      <h1 className="text-3xl mt-20 font-bold mb-8">Carbon Offset Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary">{project.registry}</Badge>
                <Badge className='text-orange-500 bg-white hover:bg-white'> <MapPin className='h-3 w-3 mr-1 ' /> {project.region}</Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {project.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3">
                {project.developer}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available Credits:</span>
                  <span className="font-medium">
                    {formatCredits(project.available_credits)} tCO₂e
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Issued:</span>
                  <span className="font-medium">
                    {formatCredits(project.issued_credits)} tCO₂e
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  // variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(project.id)}
                  className="flex-1 bg-tertiary text-black hover:bg-green-400"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a 
                    href={project.registry_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                <Button asChild>
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
      <PreFooter/>
      <Footer/>

     </div>
  );
};

export default ProjectsPage;
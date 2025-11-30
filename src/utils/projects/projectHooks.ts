import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllProjects, 
  fetchProjectsByCountry, 
  fetchProjectsByRegion,
  fetchProjectsByRegistry,
  fetchProjectDetails,
  fetchProjectsWithFilters,
  ProjectDTO,
  ProjectDetailResponse 
} from './api';

// Query keys
export const projectsQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...projectsQueryKeys.lists(), filters] as const,
  details: () => [...projectsQueryKeys.all, 'detail'] as const,
  detail: (id: string, userId: string) => [...projectsQueryKeys.details(), id, userId] as const,
};

export const useProjects = () => {
  return useQuery({
    queryKey: projectsQueryKeys.list({}),
    queryFn: fetchAllProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch projects by country
export const useProjectsByCountry = (country: string) => {
  return useQuery({
    queryKey: projectsQueryKeys.list({ country }),
    queryFn: () => fetchProjectsByCountry(country),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch projects by region
export const useProjectsByRegion = (region: string) => {
  return useQuery({
    queryKey: projectsQueryKeys.list({ region }),
    queryFn: () => fetchProjectsByRegion(region),
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch projects by registry
export const useProjectsByRegistry = (registry: string) => {
  return useQuery({
    queryKey: projectsQueryKeys.list({ registry }),
    queryFn: () => fetchProjectsByRegistry(registry),
    enabled: !!registry,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch projects with filters
export const useProjectsWithFilters = (filters: {
  country?: string;
  region?: string;
  registry?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: projectsQueryKeys.list(filters),
    queryFn: () => fetchProjectsWithFilters(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch project details
export const useProjectDetails = (projectId: string, userId: string) => {
  return useQuery({
    queryKey: projectsQueryKeys.detail(projectId, userId),
    queryFn: () => fetchProjectDetails(projectId, userId),
    enabled: !!projectId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for tracking project views (mutation)
export const useTrackProjectView = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      fetchProjectDetails(projectId, userId),
    onSuccess: (data, variables) => {
      // Update the cache with the detailed project data
      queryClient.setQueryData(
        projectsQueryKeys.detail(variables.projectId, variables.userId),
        data
      );
    },
    onError: (error) => {
      console.error('Error tracking project view:', error);
    },
  });
};
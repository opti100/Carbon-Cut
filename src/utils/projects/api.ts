import { api } from "../axios";

export interface ProjectDTO {
  id: string;
  external_reference_id: string;
  name: string;
  developer: string;
  registry: string;
  region: string;
  issued_credits: string;
  available_credits: string;
  registry_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetailDTO {
  id: string;
  external_reference_id: string;
  name: string;
  developer: string;
  description: string;
  registry: string;
  region: string;
  issued_credits: string;
  available_credits: string;
  documents: {
    registry_url: string;
    project_document: string;
    monitoring_reports: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProjectDetailResponse {
  project: ProjectDetailDTO;
  registry_redirect_url: string;
  tracking_recorded: boolean;
}

export interface ProjectsListResponse {
  projects: ProjectDTO[];
}


export interface ProjectsListResponse {
  projects: ProjectDTO[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1/inventory';

export const fetchAllProjects = async (): Promise<ProjectDTO[]> => {
  try {
    const response = await api.get<ProjectsListResponse>(`${API_BASE_URL}/projects/`);
    return response.data.projects;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export const fetchProjectsByCountry = async (country: string): Promise<ProjectDTO[]> => {
  try {
    const response = await api.get<ProjectDTO[]>(`${API_BASE_URL}/registry/projects/?country=${country}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for country ${country}:`, error);
    throw new Error(`Failed to fetch projects for ${country}`);
  }
};


export const fetchProjectsByRegion = async (region: string): Promise<ProjectDTO[]> => {
  try {
    const response = await api.get<ProjectDTO[]>(`${API_BASE_URL}/registry/projects/?region=${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for region ${region}:`, error);
    throw new Error(`Failed to fetch projects for ${region}`);
  }
};


export const fetchProjectsByRegistry = async (registry: string): Promise<ProjectDTO[]> => {
  try {
    const response = await api.get<ProjectDTO[]>(`${API_BASE_URL}/registry/projects/?registry=${registry}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for registry ${registry}:`, error);
    throw new Error(`Failed to fetch projects for ${registry}`);
  }
};


export const fetchProjectDetails = async (
  projectId: string, 
  userId: string
): Promise<ProjectDetailResponse> => {
  try {
    const response = await api.get<ProjectDetailResponse>(
      `${API_BASE_URL}/projects/${projectId}/?user_id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching project details for ${projectId}:`, error);
    throw new Error('Failed to fetch project details');
  }
};

export const searchProjects = async (query: string): Promise<ProjectDTO[]> => {
  try {
    const response = await api.get<ProjectDTO[]>(`${API_BASE_URL}/registry/projects/?search=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching projects with query ${query}:`, error);
    throw new Error('Failed to search projects');
  }
};

export const fetchProjectsWithFilters = async (filters: {
  country?: string;
  region?: string;
  registry?: string;
  search?: string;
}): Promise<ProjectDTO[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.country) params.append('country', filters.country);
    if (filters.region) params.append('region', filters.region);
    if (filters.registry) params.append('registry', filters.registry);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get<ProjectDTO[]>(
      `${API_BASE_URL}/registry/projects/?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching projects with filters:', error);
    throw new Error('Failed to fetch filtered projects');
  }
};
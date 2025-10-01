import { api } from "./axios";
import { ProjectDTO } from "@/types/project";

export const fetchProjectsByCountry = async (country: string): Promise<ProjectDTO[]> => {
  const response = await api.get(`http://127.0.0.1:8000/api/v1/inventory/registry/projects/?country=${country}`);
  return response.data;
};

export const fetchAllProjects = async (): Promise<ProjectDTO[]> => {
  const response = await api.get('http://127.0.0.1:8000/api/v1/inventory/registry/projects/');
  return response.data;
};

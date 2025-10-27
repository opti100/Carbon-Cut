import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { credentialApi } from '@/services/campaign/campaign';
import { CreateCredentialData, CredentialType } from '@/types/campaign';

export const useCredentials = (type?: CredentialType) => {
  return useQuery({
    queryKey: ['credentials', type],
    queryFn: () => credentialApi.list(type),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCredentialData) => credentialApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
};

export const useDeleteCredential = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => credentialApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
};
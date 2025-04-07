import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import apiClient from './api-client';

// For GET requests
export function createQueryHook<TResponse, TError = unknown>(
  endpoint: string,
  queryKey: string[]
) {
  return (options?: UseQueryOptions<TResponse, TError>) => {
    return useQuery<TResponse, TError>({
      queryKey: queryKey,
      queryFn: async () => {
        const { data } = await apiClient.get<TResponse>(endpoint);
        return data;
      },
      ...options,
    });
  };
}

// For POST/PUT/DELETE
// export function createMutationHook<TVariables, TResponse, TError = unknown>(
//   endpoint: string,
//   method: 'post' | 'put' | 'delete' = 'post'
// ) {
//   return (options?: UseMutationOptions<TResponse, TError, TVariables>) => {
//     return useMutation<TResponse, TError, TVariables>({
//       mutationFn: async (variables) => {
//         const { data } = await apiClient[method]<TResponse>(endpoint, variables);
//         return data;
//       },
//       ...options,
//     });
//   };
// }


export function createMutationHook<TVariables, TResponse, TError = unknown>(
  endpoint: string | ((variables: TVariables) => string), // Terima string atau fungsi
  method: 'post' | 'put' | 'delete' = 'post'
) {
  return (options?: UseMutationOptions<TResponse, TError, TVariables>) => {
    return useMutation<TResponse, TError, TVariables>({
      mutationFn: async (variables) => {
        // Jika endpoint adalah fungsi, panggil dengan variables
        const url = typeof endpoint === 'function' 
          ? endpoint(variables) 
          : endpoint;
          
        const { data } = await apiClient[method]<TResponse>(url, variables);
        return data;
      },
      ...options,
    });
  };
}
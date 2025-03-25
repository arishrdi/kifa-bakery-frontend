import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidate = (queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { invalidate };
};
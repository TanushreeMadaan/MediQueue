'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(apiCall: () => Promise<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // useCallback to prevent re-render
  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [apiCall]); 

  // Run the API call when the component mounts
  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch: execute, //refetch data
  };
}

// Mutation(Post,patch,Delelte) Hook
interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMutation<T, P>(mutationFn: (params: P) => Promise<T>) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (params: P) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await mutationFn(params);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw error; // Re-throw the error so the component can handle it if needed
      }
    },
    [mutationFn]
  );

  return {
    ...state,
    mutate,
  };
}

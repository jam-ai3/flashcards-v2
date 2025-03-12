import { useState, useEffect, Dispatch, SetStateAction } from "react";

export type NetworkRequest<T> = {
  data: T;
  error: { code: number; message: string } | null;
  loading: boolean;
};

type QueryProps<T> = {
  initialData: T;
  query: () => Promise<T>;
  callOnMount?: boolean;
};

type QueryRespone<T> = {
  data: T;
  loading: boolean;
  error: { code: number; message: string } | null;
  setData: Dispatch<SetStateAction<T>>;
  fetchData: () => Promise<void>;
  fetchDataWithoutMutation: () => Promise<T | null>;
  resetError: () => void;
};

export function useQuery<T>({
  initialData,
  query,
  callOnMount = true,
}: QueryProps<T>): QueryRespone<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await query();
      setData(res);
    } catch (error: any) {
      console.error(error);
      const code: number = error.response.status ?? -1;
      const message: string = error.response.data.message;
      setError({ code, message });
    } finally {
      setLoading(false);
    }
  }

  async function fetchDataWithoutMutation() {
    setLoading(true);
    setError(null);
    try {
      const res = await query();
      return res;
    } catch (error: any) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
    return null;
  }

  function resetError() {
    setError(null);
  }

  useEffect(() => {
    if (callOnMount) {
      fetchData();
    }
  }, []);

  return {
    data,
    loading,
    error,
    setData,
    fetchData,
    fetchDataWithoutMutation,
    resetError,
  };
}

type MutationProps<T> = {
  mutation: (...args: any) => Promise<T>;
};

type MutationRespone<T> = {
  mutate: (...args: any) => Promise<T | null>;
  loading: boolean;
  error: { code: number; message: string } | null;
  resetError: () => void;
};

export function useMutation<T>({
  mutation,
}: MutationProps<T>): MutationRespone<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  async function mutate(...args: any) {
    setLoading(true);
    setError(null);
    try {
      const res = await mutation(...args);
      return res;
    } catch (error: any) {
      const code: number = error.response.status ?? -1;
      const message: string = error.response.data.message;
      setError({ code, message });
    } finally {
      setLoading(false);
    }
    return null;
  }

  function resetError() {
    setError(null);
  }

  return { mutate, loading, error, resetError };
}

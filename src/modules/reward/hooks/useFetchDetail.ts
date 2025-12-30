import { useEffect, useState, useCallback } from "react";
import { ApiResponse } from "shared/types";

export const useFetchDetail = <T>(
  fetchFn: () => Promise<ApiResponse<T>>
) => {
  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetchFn();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || "Fetch failed");
      }
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setIsFetching(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isFetching, error, refetch: fetchData };
};

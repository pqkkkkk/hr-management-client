import { useEffect, useState, useCallback, useRef } from "react";
import { ApiResponse, Page } from "shared/types";

export const useFetchList = <Q extends object, T extends object>(
  fetchFn: (query: Q) => Promise<ApiResponse<Page<T>>>,
  query: Q
) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<Page<T> | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useRef để lưu fetchFn, tránh dependency thay đổi
  const fetchFnRef = useRef(fetchFn);
  
  // Cập nhật ref mỗi khi fetchFn thay đổi
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const refetch = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetchFnRef.current(query);
      if (response.success && response.data) {
        setData(response.data.content);
        setPage(response.data);
      } else {
        setError(response.message || "Failed to fetch data");
        setData([]);
        setPage(null);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err?.message || "An error occurred");
      setData([]);
      setPage(null);
    } finally {
      setIsFetching(false);
    }
  }, [query]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    page,
    totalPages: page?.totalPages || 0,
    totalElements: page?.totalElements || 0,
    isFetching,
    error,
    refetch,
  };
};
import { useEffect, useRef, useState } from "react";
import { fetchSales } from "../services/salesApi";

export const useSalesQuery = (filters) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
    const abortController = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchSales(filters, abortController.signal);
        setData(payload);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => abortController.abort();
  }, [filters]);

  return { data, isLoading, error };
};

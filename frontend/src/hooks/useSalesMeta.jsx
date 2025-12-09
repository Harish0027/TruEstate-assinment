import { useEffect, useState } from "react";
import { fetchSalesMeta } from "../services/salesApi";

const EMPTY_META = {
  regions: [],
  genders: [],
  productCategories: [],
  paymentMethods: [],
  tags: [],
};

export const useSalesMeta = () => {
  const [data, setData] = useState(EMPTY_META);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchSalesMeta();
        if (active) {
          setData({ ...EMPTY_META, ...payload });
        }
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
};

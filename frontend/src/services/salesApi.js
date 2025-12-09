const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const buildQueryString = (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.regions?.length) params.set("regions", filters.regions.join(","));
  if (filters.genders?.length) params.set("genders", filters.genders.join(","));
  if (filters.productCategories?.length)
    params.set("productCategories", filters.productCategories.join(","));
  if (filters.tags?.length) params.set("tags", filters.tags.join(","));
  if (filters.paymentMethods?.length)
    params.set("paymentMethods", filters.paymentMethods.join(","));

  if (filters.age?.min != null) params.set("ageMin", filters.age.min);
  if (filters.age?.max != null) params.set("ageMax", filters.age.max);

  if (filters.dateRange?.from) params.set("dateFrom", filters.dateRange.from);
  if (filters.dateRange?.to) params.set("dateTo", filters.dateRange.to);

  if (filters.sort?.by) params.set("sortBy", filters.sort.by);
  if (filters.sort?.order) params.set("sortOrder", filters.sort.order);

  if (filters.pagination?.page) params.set("page", filters.pagination.page);
  if (filters.pagination?.limit) params.set("limit", filters.pagination.limit);

  return params.toString();
};

export const fetchSales = async (filters, signal) => {
  const query = buildQueryString(filters);
  const response = await fetch(`${API_BASE_URL}/api/sales?${query}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load sales");
  }

  return response.json();
};

export const fetchSalesMeta = async () => {
  const response = await fetch(`${API_BASE_URL}/api/sales/meta`);

  if (!response.ok) {
    throw new Error("Failed to load sales metadata");
  }

  return response.json();
};

import { useMemo, useState } from "react";
import { Layout } from "./components/Layout";
import { TopBar } from "./components/TopBar";
import { SummaryStrip } from "./components/SummaryStrip";
import { FilterBar } from "./components/FilterBar";
import { SalesTable } from "./components/SalesTable";
import { Pagination } from "./components/Pagination";
import { useSalesQuery } from "./hooks/useSalesQuery";
import { useSalesMeta } from "./hooks/useSalesMeta";

const PAGE_SIZE = 10;

const defaultFilters = {
  search: "",
  regions: [],
  genders: [],
  age: { min: undefined, max: undefined },
  productCategories: [],
  tags: [],
  paymentMethods: [],
  dateRange: { from: undefined, to: undefined },
  sort: { by: "date", order: "desc" },
  pagination: { page: 1, limit: PAGE_SIZE },
};

function App() {
  const [filters, setFilters] = useState(defaultFilters);

  const { data, isLoading, error } = useSalesQuery(filters);
  const { data: meta } = useSalesMeta();

  const pagination = useMemo(
    () => ({
      page: filters.pagination.page,
      totalPages: data?.totalPages ?? 1,
      total: data?.total ?? 0,
    }),
    [filters.pagination.page, data]
  );

  const handleSearchChange = (search) => {
    setFilters((prev) => {
      if (prev.search === search) return prev;
      return {
        ...prev,
        search,
        pagination: { ...prev.pagination, page: 1 },
      };
    });
  };

  const handleFiltersChange = (partial) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  };

  const stats = useMemo(() => {
    const items = data?.items ?? [];
    const totalUnits = items.reduce(
      (sum, entry) => sum + (entry.Quantity ?? 0),
      0
    );
    const totalRevenue = items.reduce(
      (sum, entry) => sum + (entry["Final Amount"] ?? 0),
      0
    );
    const totalDiscount = items.reduce((sum, entry) => {
      const total = entry["Total Amount"] ?? entry["Final Amount"] ?? 0;
      const final = entry["Final Amount"] ?? 0;
      return sum + Math.max(total - final, 0);
    }, 0);

    return {
      totalUnits,
      totalRevenue,
      totalDiscount,
    };
  }, [data]);

  return (
    <Layout
      topBar={
        <TopBar
          searchValue={filters.search}
          onSearchChange={handleSearchChange}
        />
      }
    >
      <div className="grid gap-6">
        <SummaryStrip stats={stats} />
        <FilterBar
          value={filters}
          onChange={handleFiltersChange}
          sortValue={filters.sort}
          onSortChange={handleSortChange}
          options={meta}
        />
        <SalesTable
          data={data?.items ?? []}
          isLoading={isLoading}
          error={error}
        />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          pageSize={filters.pagination.limit}
          onChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}

export default App;

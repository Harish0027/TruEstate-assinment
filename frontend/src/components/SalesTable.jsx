import PropTypes from "prop-types";

const columns = [
  { key: "Date", label: "Date" },
  { key: "Customer Name", label: "Customer" },
  { key: "Phone Number", label: "Phone" },
  { key: "Customer Region", label: "Region" },
  { key: "Product Name", label: "Product" },
  { key: "Product Category", label: "Category" },
  { key: "Quantity", label: "Qty" },
  { key: "Final Amount", label: "Final" },
  { key: "Order Status", label: "Status" },
];

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const SalesTable = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid gap-2 rounded-xl border border-border bg-background p-6">
        <div className="h-5 w-48 animate-pulse rounded bg-secondary" />
        <div className="grid gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-secondary"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load sales. Please retry later.
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-border bg-background p-12 text-center text-sm text-muted-foreground">
        No sales match the current filters. Adjust search or filters to discover
        results.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full border-collapse bg-card text-sm">
        <thead className="bg-secondary text-secondary-foreground">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr
              key={`${entry["Sales ID"] ?? entry["Order ID"] ?? Math.random()}`}
              className="border-t border-border/60"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 align-top text-foreground/85"
                >
                  {renderCell(column.key, entry)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SalesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
};

const renderCell = (key, row) => {
  const value = row[key];

  switch (key) {
    case "Date":
      return formatDate(value);
    case "Final Amount":
      return (
        <span className="font-semibold text-primary">
          {formatCurrency(value)}
        </span>
      );
    case "Order Status":
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            value === "Delivered"
              ? "bg-emerald-100 text-emerald-700"
              : value === "Pending"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {value || "-"}
        </span>
      );
    default:
      return value ?? "-";
  }
};

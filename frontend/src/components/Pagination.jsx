import PropTypes from "prop-types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const Pagination = ({ page, totalPages, total, pageSize, onChange }) => {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm">
      <div className="text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {Math.min((page - 1) * pageSize + 1, total)}
        </span>
        -
        <span className="font-semibold text-foreground">
          {Math.min(page * pageSize, total)}
        </span>{" "}
        of
        <span className="font-semibold text-foreground"> {total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onChange(page - 1)}
          disabled={isFirst}
        >
          <ChevronLeftIcon className="h-4 w-4" /> Prev
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onChange(page + 1)}
          disabled={isLast}
        >
          Next <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

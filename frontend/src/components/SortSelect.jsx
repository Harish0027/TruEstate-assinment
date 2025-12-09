import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const OPTIONS = [
  { value: { by: "date", order: "desc" }, label: "Date · Newest first" },
  { value: { by: "date", order: "asc" }, label: "Date · Oldest first" },
  { value: { by: "quantity", order: "desc" }, label: "Quantity · High to low" },
  { value: { by: "quantity", order: "asc" }, label: "Quantity · Low to high" },
  { value: { by: "customerName", order: "asc" }, label: "Customer · A → Z" },
  { value: { by: "customerName", order: "desc" }, label: "Customer · Z → A" },
];

const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return { open, setOpen, containerRef };
};

export const SortSelect = ({ value, onChange }) => {
  const selectedOption = OPTIONS.find(
    (option) =>
      option.value.by === value.by && option.value.order === value.order
  );
  const { open, setOpen, containerRef } = useDropdown();

  return (
    <div
      ref={containerRef}
      className="relative inline-block min-w-[220px] text-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground shadow-sm transition hover:border-primary/40"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          Sort
          <span className="font-semibold text-foreground">
            {selectedOption?.label ?? "Select"}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-muted-foreground transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
        <span className="sr-only">Toggle sort menu</span>
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-[260px] rounded-lg border border-border bg-card p-2 shadow-lg">
          <ul className="grid gap-1">
            {OPTIONS.map((option) => {
              const active =
                option.value.by === value.by &&
                option.value.order === value.order;
              return (
                <li key={`${option.value.by}-${option.value.order}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition hover:bg-muted/70 ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{option.label}</span>
                    {active ? (
                      <span className="text-[10px] font-semibold uppercase text-primary">
                        Active
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

SortSelect.propTypes = {
  value: PropTypes.shape({
    by: PropTypes.string,
    order: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

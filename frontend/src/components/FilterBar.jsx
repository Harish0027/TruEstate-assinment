import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { SortSelect } from "./SortSelect";

const toggleValue = (list, value) => {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }
  return [...list, value];
};

export const FilterBar = ({
  value,
  onChange,
  sortValue,
  onSortChange,
  options,
}) => {
  const regionOptions = options?.regions ?? [];
  const genderOptions = options?.genders ?? [];
  const categoryOptions = options?.productCategories ?? [];
  const tagOptions = options?.tags ?? [];
  const paymentOptions = options?.paymentMethods ?? [];

  return (
    <section className="rounded-xl border border-border bg-card/80 shadow-sm">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Filters</p>
          </div>
          <div className="sm:self-start">
            <SortSelect value={sortValue} onChange={onSortChange} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterDropdown
            className="w-full"
            label="Customer Region"
            selections={value.regions}
            onToggle={(item) =>
              onChange({ regions: toggleValue(value.regions, item) })
            }
            options={regionOptions}
          />
          <FilterDropdown
            className="w-full"
            label="Gender"
            selections={value.genders}
            onToggle={(item) =>
              onChange({ genders: toggleValue(value.genders, item) })
            }
            options={genderOptions}
          />
          <RangeInput
            className="w-full"
            label="Age Range"
            value={value.age}
            onChange={(age) => onChange({ age })}
          />
          <FilterDropdown
            className="w-full"
            label="Product Category"
            selections={value.productCategories}
            onToggle={(item) =>
              onChange({
                productCategories: toggleValue(value.productCategories, item),
              })
            }
            options={categoryOptions}
          />
          <FilterDropdown
            className="w-full"
            label="Tags"
            selections={value.tags}
            onToggle={(item) =>
              onChange({ tags: toggleValue(value.tags, item) })
            }
            options={tagOptions}
          />
          <FilterDropdown
            className="w-full"
            label="Payment Method"
            selections={value.paymentMethods}
            onToggle={(item) =>
              onChange({
                paymentMethods: toggleValue(value.paymentMethods, item),
              })
            }
            options={paymentOptions}
          />
          <DateRangeInput
            className="w-full"
            value={value.dateRange}
            onChange={(dateRange) => onChange({ dateRange })}
          />
        </div>
      </div>
    </section>
  );
};

FilterBar.propTypes = {
  value: PropTypes.shape({
    regions: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    age: PropTypes.shape({
      min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    productCategories: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    paymentMethods: PropTypes.arrayOf(PropTypes.string),
    dateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  sortValue: PropTypes.shape({
    by: PropTypes.string,
    order: PropTypes.string,
  }).isRequired,
  onSortChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    regions: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    productCategories: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    paymentMethods: PropTypes.arrayOf(PropTypes.string),
  }),
};

FilterBar.defaultProps = {
  options: {},
};

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

const FilterDropdown = ({
  label,
  selections,
  onToggle,
  options,
  className,
}) => {
  const { open, setOpen, containerRef } = useDropdown();
  const containerClasses = ["relative", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={containerClasses}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {label}
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
            {selections.length}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-3 w-3 text-muted-foreground transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-48 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="flex flex-col gap-2">
            {options.map((option) => {
              const active = selections.includes(option);
              return (
                <label key={option} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggle(option)}
                    className="accent-primary"
                  />
                  <span
                    className={
                      active
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

FilterDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  selections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

FilterDropdown.defaultProps = {
  className: undefined,
};

const RangeInput = ({ label, value, onChange, className }) => {
  const { open, setOpen, containerRef } = useDropdown();
  const containerClasses = ["relative", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={containerClasses}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        {label}
        <ChevronDownIcon
          className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-52 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="grid gap-3 text-xs text-muted-foreground">
            <label className="grid gap-1">
              Min
              <input
                type="number"
                value={value?.min ?? ""}
                min={0}
                onChange={(event) =>
                  onChange({
                    min: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                    max: value?.max,
                  })
                }
                className="h-9 rounded-md border border-border px-2 text-sm"
              />
            </label>
            <label className="grid gap-1">
              Max
              <input
                type="number"
                value={value?.max ?? ""}
                min={0}
                onChange={(event) =>
                  onChange({
                    max: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                    min: value?.min,
                  })
                }
                className="h-9 rounded-md border border-border px-2 text-sm"
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
};

RangeInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RangeInput.defaultProps = {
  className: undefined,
};

const DateRangeInput = ({ value, onChange, className }) => {
  const { open, setOpen, containerRef } = useDropdown();
  const containerClasses = ["relative", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={containerClasses}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        Date
        <ChevronDownIcon
          className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-56 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="grid gap-3 text-xs text-muted-foreground">
            <label className="grid gap-1">
              From
              <input
                type="date"
                value={value?.from ?? ""}
                onChange={(event) =>
                  onChange({
                    from: event.target.value || undefined,
                    to: value?.to,
                  })
                }
                className="h-9 rounded-md border border-border px-2 text-sm"
              />
            </label>
            <label className="grid gap-1">
              To
              <input
                type="date"
                value={value?.to ?? ""}
                onChange={(event) =>
                  onChange({
                    from: value?.from,
                    to: event.target.value || undefined,
                  })
                }
                className="h-9 rounded-md border border-border px-2 text-sm"
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
};

DateRangeInput.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

DateRangeInput.defaultProps = {
  className: undefined,
};

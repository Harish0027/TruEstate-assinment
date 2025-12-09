import PropTypes from "prop-types";
import { useMemo } from "react";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import {
  REGION_OPTIONS,
  GENDER_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
  TAG_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "../constants/filters";

const toggleValue = (list, value) => {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }
  return [...list, value];
};

export const FilterPanel = ({ value, onChange }) => {
  const appliedFilters = useMemo(() => {
    const count = [
      value.regions.length,
      value.genders.length,
      value.productCategories.length,
      value.tags.length,
      value.paymentMethods.length,
      value.age?.min ? 1 : 0,
      value.age?.max ? 1 : 0,
      value.dateRange?.from ? 1 : 0,
      value.dateRange?.to ? 1 : 0,
    ].reduce((acc, item) => acc + item, 0);

    return count;
  }, [value]);

  const handleReset = () => {
    onChange({
      regions: [],
      genders: [],
      productCategories: [],
      tags: [],
      paymentMethods: [],
      age: { min: undefined, max: undefined },
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <aside className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Filters
          </h2>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
          {appliedFilters}
        </span>
      </header>

      <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-sm">
        <FilterGroup
          title="Customer Region"
          options={REGION_OPTIONS}
          selected={value.regions}
          onToggle={(option) =>
            onChange({ regions: toggleValue(value.regions, option) })
          }
        />

        <FilterGroup
          title="Gender"
          options={GENDER_OPTIONS}
          selected={value.genders}
          onToggle={(option) =>
            onChange({ genders: toggleValue(value.genders, option) })
          }
        />

        <RangeGroup
          title="Age Range"
          min={value.age?.min ?? ""}
          max={value.age?.max ?? ""}
          onChange={(next) => onChange({ age: next })}
        />

        <FilterGroup
          title="Product Category"
          options={PRODUCT_CATEGORY_OPTIONS}
          selected={value.productCategories}
          onToggle={(option) =>
            onChange({
              productCategories: toggleValue(value.productCategories, option),
            })
          }
        />

        <FilterGroup
          title="Tags"
          options={TAG_OPTIONS}
          selected={value.tags}
          onToggle={(option) =>
            onChange({ tags: toggleValue(value.tags, option) })
          }
        />

        <FilterGroup
          title="Payment Method"
          options={PAYMENT_METHOD_OPTIONS}
          selected={value.paymentMethods}
          onToggle={(option) =>
            onChange({
              paymentMethods: toggleValue(value.paymentMethods, option),
            })
          }
        />

        <DateRangeGroup
          value={value.dateRange}
          onChange={(dateRange) => onChange({ dateRange })}
        />
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary"
        onClick={handleReset}
      >
        <RotateCcwIcon className="h-4 w-4" />
        Reset Filters
      </button>
    </aside>
  );
};

FilterPanel.propTypes = {
  value: PropTypes.shape({
    regions: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    productCategories: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    paymentMethods: PropTypes.arrayOf(PropTypes.string),
    age: PropTypes.shape({
      min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    dateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const FilterGroup = ({ title, options, selected, onToggle }) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            type="button"
            key={option}
            onClick={() => onToggle(option)}
            className={`rounded-md border px-3 py-1 text-xs transition ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </section>
);

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

const RangeGroup = ({ title, min, max, onChange }) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Min
        <input
          type="number"
          min={0}
          value={min}
          onChange={(event) =>
            onChange({
              min: event.target.value ? Number(event.target.value) : undefined,
              max,
            })
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Max
        <input
          type="number"
          min={0}
          value={max}
          onChange={(event) =>
            onChange({
              max: event.target.value ? Number(event.target.value) : undefined,
              min,
            })
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        />
      </label>
    </div>
  </section>
);

RangeGroup.propTypes = {
  title: PropTypes.string.isRequired,
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
};

const DateRangeGroup = ({ value, onChange }) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Date Range
    </h3>
    <div className="grid grid-cols-2 gap-3">
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        From
        <input
          type="date"
          value={value?.from ?? ""}
          onChange={(event) =>
            onChange({ from: event.target.value || undefined, to: value?.to })
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        To
        <input
          type="date"
          value={value?.to ?? ""}
          onChange={(event) =>
            onChange({ from: value?.from, to: event.target.value || undefined })
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        />
      </label>
    </div>
  </section>
);

DateRangeGroup.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const SearchBar = ({ value, onChange, delay = 300 }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const lastEmittedValue = useRef(value || "");

  // Sync with external value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      // Avoid firing if value hasn’t changed
      if (lastEmittedValue.current !== inputValue) {
        onChange(inputValue);
        lastEmittedValue.current = inputValue;
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, delay, onChange]);

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 shadow-sm md:w-80 h-9">
      <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by customer or phone"
        className="flex-1 bg-transparent text-sm outline-none h-7"
      />

      {inputValue ? (
        <button
          type="button"
          onClick={() => setInputValue("")}
          className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground transition hover:bg-secondary"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
};

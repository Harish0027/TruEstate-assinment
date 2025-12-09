import PropTypes from "prop-types";
import { BellIcon, SettingsIcon } from "lucide-react";
import { SearchBar } from "./SearchBar";

export const TopBar = ({ searchValue, onSearchChange }) => (
  <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
    {/* Left Section */}
    <div className="flex flex-col text-center sm:text-left">
      <h1 className="text-base sm:text-lg font-semibold">
        Sales Management System
      </h1>
      <p className="text-[10px] sm:text-xs text-muted-foreground">
        Operations overview · TruEstate
      </p>
    </div>

    {/* Right Section (ALWAYS 1 LINE on mobile/tablet) */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
      {/* Search Bar compact */}
      <div className="flex-1 min-w-[160px] sm:min-w-[200px] md:min-w-[240px]">
        <SearchBar value={searchValue} onChange={onSearchChange} delay={500} />
      </div>

      {/* Icons + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <HeaderIconButton icon={BellIcon} label="View notifications" />
          <HeaderIconButton icon={SettingsIcon} label="Open settings" />
        </div>

        <div
          className="flex items-center justify-center 
      h-8 w-8 sm:h-9 sm:w-9 
      rounded-full bg-gradient-to-br from-primary to-primary/80 
      text-xs sm:text-sm font-semibold text-primary-foreground"
        >
          HS
        </div>
      </div>
    </div>
  </div>
);

TopBar.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
};

const HeaderIconButton = ({ icon: Icon, label }) => (
  <button
    type="button"
    className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </button>
);

HeaderIconButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

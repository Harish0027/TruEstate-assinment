import PropTypes from "prop-types";

const NAV_ITEMS = [
  { label: "Dashboard" },
  { label: "Nexus" },
  { label: "Intake" },
];

const SERVICE_ITEMS = ["Pre-active", "Active", "Blocked", "Closed"];

const INVOICE_ITEMS = ["Proforma Invoices", "Final Invoices"];

export const Layout = ({ topBar, children }) => (
  <div className="min-h-screen max-h-screen overflow-hidden bg-[#f7f8fb] text-foreground">
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card/60 lg:px-6 lg:py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          HS
        </div>
        <div>
          <p className="text-sm font-semibold">Vault</p>
          <p className="text-xs text-muted-foreground">Harish Sutar</p>
        </div>
      </div>

      <NavigationSection title="Dashboard" items={NAV_ITEMS} />
      <NavigationSection title="Services" items={SERVICE_ITEMS} />
      <NavigationSection title="Invoices" items={INVOICE_ITEMS} />
    </aside>

    <div className="flex min-h-screen max-h-screen flex-col overflow-hidden lg:ml-64">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-card/90 px-8 py-5 shadow-sm backdrop-blur">
        {topBar}
      </header>
      <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
    </div>
  </div>
);

Layout.propTypes = {
  topBar: PropTypes.node,
  children: PropTypes.node,
};

const NavigationSection = ({ title, items }) => (
  <div className="mb-8 grid gap-3">
    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h2>
    <nav className="grid gap-2 text-sm">
      {items.map((item) => (
        <button
          key={item.label ?? item}
          type="button"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-left font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <span>{item.label ?? item}</span>
          {item.short ? (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
              {item.short}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  </div>
);

NavigationSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        short: PropTypes.string,
      }),
    ])
  ).isRequired,
};

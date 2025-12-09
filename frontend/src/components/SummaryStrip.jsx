import PropTypes from "prop-types";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const SummaryStrip = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <SummaryCard
      title="Total units sold"
      value={stats.totalUnits}
      tone="neutral"
    />
    <SummaryCard
      title="Total revenue"
      value={formatCurrency(stats.totalRevenue)}
      tone="neutral"
    />
    <SummaryCard
      title="Total discount"
      value={formatCurrency(stats.totalDiscount)}
      tone="muted"
    />
  </div>
);

SummaryStrip.propTypes = {
  stats: PropTypes.shape({
    totalUnits: PropTypes.number,
    totalRevenue: PropTypes.number,
    totalDiscount: PropTypes.number,
  }).isRequired,
};

const SummaryCard = ({ title, value, tone }) => {
  const classes = {
    neutral: "bg-card",
    accent: "bg-primary text-primary-foreground",
    muted: "bg-secondary text-secondary-foreground",
  }[tone];

  const labelColor =
    tone === "accent"
      ? "text-primary-foreground/70"
      : "text-muted-foreground/80";

  return (
    <div
      className={`rounded-xl border border-border px-5 py-4 shadow-sm ${classes}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${labelColor}`}
      >
        {title}
      </p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["neutral", "accent", "muted"]).isRequired,
};

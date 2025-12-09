const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const CSV_FILE_NAME = "truestate_assignment_dataset.csv";

const numericFields = new Set([
  "Age",
  "Quantity",
  "Price per Unit",
  "Discount Percentage",
  "Total Amount",
  "Final Amount",
]);

let store;

const parseNumeric = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeTags = (value) => {
  if (!value) return [];
  return value
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const sanitizePhone = (value) => {
  if (!value) return "";
  return String(value).replace(/\s+/g, "");
};

const normalizeRecord = (record) => {
  const normalized = { ...record };

  numericFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(normalized, field)) {
      const parsed = parseNumeric(normalized[field]);
      if (parsed !== undefined) {
        normalized[field] = parsed;
      }
    }
  });

  if (Object.prototype.hasOwnProperty.call(normalized, "Tags")) {
    normalized.Tags = normalizeTags(normalized.Tags);
  } else {
    normalized.Tags = [];
  }

  const customerName = normalized["Customer Name"] || "";
  const phone = normalized["Phone Number"] || "";
  const dateValue = normalized.Date ? Date.parse(normalized.Date) : Number.NaN;

  normalized.__customerNameLower = customerName.toLowerCase();
  normalized.__phoneNormalized = sanitizePhone(phone);
  normalized.__dateValue = Number.isNaN(dateValue) ? undefined : dateValue;

  return normalized;
};

const pushToIndex = (map, key, index) => {
  if (!key) return;
  if (!map.has(key)) {
    map.set(key, []);
  }
  map.get(key).push(index);
};

const buildIndexes = (dataset) => {
  const region = new Map();
  const gender = new Map();
  const productCategory = new Map();
  const paymentMethod = new Map();
  const tags = new Map();

  dataset.forEach((entry, index) => {
    pushToIndex(region, entry["Customer Region"], index);
    pushToIndex(gender, entry.Gender, index);
    pushToIndex(productCategory, entry["Product Category"], index);
    pushToIndex(paymentMethod, entry["Payment Method"], index);
    entry.Tags.forEach((tag) => pushToIndex(tags, tag, index));
  });

  return {
    region,
    gender,
    productCategory,
    paymentMethod,
    tags,
  };
};

const buildSorts = (dataset) => {
  const baseIndices = Array.from(
    { length: dataset.length },
    (_, index) => index
  );

  const sortBy = (comparator) => [...baseIndices].sort(comparator);

  const getDateValue = (entry) => entry.__dateValue ?? 0;

  const sorts = {
    "date:desc": sortBy(
      (a, b) => getDateValue(dataset[b]) - getDateValue(dataset[a])
    ),
    "date:asc": sortBy(
      (a, b) => getDateValue(dataset[a]) - getDateValue(dataset[b])
    ),
    "quantity:desc": sortBy(
      (a, b) => (dataset[b].Quantity || 0) - (dataset[a].Quantity || 0)
    ),
    "quantity:asc": sortBy(
      (a, b) => (dataset[a].Quantity || 0) - (dataset[b].Quantity || 0)
    ),
    "customerName:asc": sortBy((a, b) =>
      (dataset[a].__customerNameLower || "").localeCompare(
        dataset[b].__customerNameLower || ""
      )
    ),
    "customerName:desc": sortBy((a, b) =>
      (dataset[b].__customerNameLower || "").localeCompare(
        dataset[a].__customerNameLower || ""
      )
    ),
  };

  return sorts;
};

const buildPositions = (sorts, size) => {
  const positions = {};

  Object.entries(sorts).forEach(([key, indices]) => {
    const map = new Uint32Array(size);
    indices.forEach((entryIndex, position) => {
      map[entryIndex] = position;
    });
    positions[key] = map;
  });

  return positions;
};

const loadStore = () => {
  if (store) {
    return store;
  }

  const datasetPath = path.join(__dirname, "..", "..", "data", CSV_FILE_NAME);

  try {
    const fileContents = fs.readFileSync(datasetPath, "utf-8");
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const dataset = records.map(normalizeRecord);
    const indexes = buildIndexes(dataset);
    const sorts = buildSorts(dataset);
    const positions = buildPositions(sorts, dataset.length);

    store = {
      dataset,
      indexes,
      sorts,
      positions,
    };

    return store;
  } catch (error) {
    error.message = `Unable to load sales dataset (${CSV_FILE_NAME}): ${error.message}`;
    throw error;
  }
};

module.exports = {
  getSalesDataset: () => loadStore().dataset,
  getSalesStore: loadStore,
};

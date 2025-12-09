const SORT_KEYS = new Set(["date", "quantity", "customerName"]);

const normalizeSort = ({ by, order } = {}) => {
  const byKey = SORT_KEYS.has(by) ? by : "date";
  const ord = order === "asc" ? "asc" : "desc";
  return { by: byKey, order: ord };
};

const safePagination = ({ page, limit } = {}) => ({
  page: Number(page) > 0 ? Number(page) : 1,
  limit: Number(limit) > 0 ? Number(limit) : 10,
});

const unionFromIndex = (map, values) => {
  if (!values?.length) return null;

  const result = new Set();
  values.forEach((v) => {
    const arr = map.get(v);
    if (arr) arr.forEach((i) => result.add(i));
  });

  return result;
};

const intersect = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  const out = new Set();
  a.forEach((x) => b.has(x) && out.add(x));
  return out;
};

const needsPostFilters = (filters, search) => {
  if (search?.trim()) return true;
  if (filters.age?.min || filters.age?.max) return true;
  if (filters.dateRange?.from || filters.dateRange?.to) return true;
  return false;
};

const matchesAge = (age, range) => {
  if (range.min && age < range.min) return false;
  if (range.max && age > range.max) return false;
  return true;
};

const matchesDate = (value, range) => {
  if (range.from && value < range.from.getTime()) return false;
  if (range.to && value > range.to.getTime()) return false;
  return true;
};

const recordMatchesPostFilter = (rec, searchLower, phoneQuery, filters) => {
  if (searchLower) {
    if (
      !rec.CustomerNameLower.includes(searchLower) &&
      !rec.PhoneNormalized.includes(phoneQuery)
    )
      return false;
  }

  if ((filters.age.min || filters.age.max) && !matchesAge(rec.Age, filters.age))
    return false;

  if (!matchesDate(rec.DateValue, filters.dateRange)) return false;

  return true;
};

const sliceByIndices = (sorted, dataset, offset, limit) => {
  return sorted.slice(offset, offset + limit).map((i) => dataset[i]);
};

function getSales({
  searchTerm,
  filters,
  sort,
  pagination,
  dataset,
  indexes,
  sorts,
  positions,
}) {
  const { page, limit } = safePagination(pagination);
  const offset = (page - 1) * limit;

  const normalizedSort = normalizeSort(sort);
  const sortKey = `${normalizedSort.by}:${normalizedSort.order}`;

  const sortedIndices = sorts[sortKey] || sorts["date:desc"];
  const positionLookup = positions[sortKey] || positions["date:desc"];

  // Build candidate set
  let candidate = null;
  candidate = intersect(
    candidate,
    unionFromIndex(indexes.region, filters.regions)
  );
  candidate = intersect(
    candidate,
    unionFromIndex(indexes.gender, filters.genders)
  );
  candidate = intersect(
    candidate,
    unionFromIndex(indexes.productCategory, filters.productCategories)
  );
  candidate = intersect(
    candidate,
    unionFromIndex(indexes.paymentMethod, filters.paymentMethods)
  );
  candidate = intersect(candidate, unionFromIndex(indexes.tags, filters.tags));

  const requiresPost = needsPostFilters(filters, searchTerm);

  if (!requiresPost) {
    if (!candidate) {
      const total = dataset.length;
      const items = sliceByIndices(sortedIndices, dataset, offset, limit);
      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
      };
    }
    const ordered = [...candidate].sort(
      (a, b) => positionLookup[a] - positionLookup[b]
    );
    const total = ordered.length;
    const items = sliceByIndices(ordered, dataset, offset, limit);
    return { page, limit, total, totalPages: Math.ceil(total / limit), items };
  }

  // POST FILTER PATH
  const searchLower = (searchTerm || "").toLowerCase();
  const phoneQuery = (searchTerm || "").replace(/\s+/g, "");

  const toScan = candidate
    ? [...candidate].sort((a, b) => positionLookup[a] - positionLookup[b])
    : sortedIndices;

  const result = [];
  let matched = 0;

  for (const idx of toScan) {
    const rec = dataset[idx];

    if (!recordMatchesPostFilter(rec, searchLower, phoneQuery, filters))
      continue;

    if (matched >= offset && result.length < limit) result.push(rec);

    matched++;
  }

  return {
    page,
    limit,
    total: matched,
    totalPages: Math.ceil(matched / limit),
    items: result,
  };
}

function getSalesMeta({ indexes }) {
  const serialize = (map) => [...map.keys()].sort();
  return {
    regions: serialize(indexes.region),
    genders: serialize(indexes.gender),
    productCategories: serialize(indexes.productCategory),
    paymentMethods: serialize(indexes.paymentMethod),
    tags: serialize(indexes.tags),
  };
}

module.exports = { getSales, getSalesMeta };

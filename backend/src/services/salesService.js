const { getSalesStore } = require("../utils/dataLoader");

const SORT_KEYS = new Set(["date", "quantity", "customerName"]);

const normalizeSort = ({ by, order } = {}) => {
  const normalizedBy = SORT_KEYS.has(by) ? by : "date";
  const normalizedOrder = order === "asc" ? "asc" : "desc";
  return { by: normalizedBy, order: normalizedOrder };
};

const safePagination = (pagination = {}) => {
  const page =
    Number.isInteger(pagination.page) && pagination.page > 0
      ? pagination.page
      : 1;
  const limit =
    Number.isInteger(pagination.limit) && pagination.limit > 0
      ? pagination.limit
      : 10;
  return { page, limit };
};

const unionFromIndex = (map, values = []) => {
  if (!values || values.length === 0) return null;
  const set = new Set();
  values.forEach((value) => {
    const indices = map.get(value);
    if (indices) {
      indices.forEach((index) => set.add(index));
    }
  });
  return set;
};

const intersectSets = (a, b) => {
  if (!a || a.size === 0 || !b || b.size === 0) {
    return new Set();
  }

  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  const result = new Set();
  small.forEach((value) => {
    if (large.has(value)) {
      result.add(value);
    }
  });
  return result;
};

const combineWithIntersection = (base, next) => {
  if (!next) return base;
  if (!base) return next;
  return intersectSets(base, next);
};

const buildTagsIntersection = (indexMap, tags = []) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const tagArrays = tags
    .map((tag) => indexMap.get(tag))
    .filter((entry) => Array.isArray(entry));

  if (tagArrays.length !== tags.length) {
    return new Set();
  }

  tagArrays.sort((a, b) => a.length - b.length);
  let intersection = new Set(tagArrays[0]);

  for (let idx = 1; idx < tagArrays.length && intersection.size > 0; idx += 1) {
    const nextArray = tagArrays[idx];
    const nextSet = new Set();
    nextArray.forEach((candidate) => {
      if (intersection.has(candidate)) {
        nextSet.add(candidate);
      }
    });
    intersection = nextSet;
  }

  return intersection;
};

const buildCandidateSet = (filters = {}, indexes) => {
  let result = null;

  result = combineWithIntersection(
    result,
    unionFromIndex(indexes.region, filters.regions)
  );
  result = combineWithIntersection(
    result,
    unionFromIndex(indexes.gender, filters.genders)
  );
  result = combineWithIntersection(
    result,
    unionFromIndex(indexes.productCategory, filters.productCategories)
  );
  result = combineWithIntersection(
    result,
    unionFromIndex(indexes.paymentMethod, filters.paymentMethods)
  );
  result = combineWithIntersection(
    result,
    buildTagsIntersection(indexes.tags, filters.tags)
  );

  return result;
};

const needsPostFilters = (filters = {}, searchTerm) => {
  const trimmedSearch = searchTerm ? searchTerm.trim() : "";
  if (trimmedSearch.length > 0) {
    return true;
  }

  const hasAgeMin = typeof filters.age?.min === "number";
  const hasAgeMax = typeof filters.age?.max === "number";
  if (hasAgeMin || hasAgeMax) {
    return true;
  }

  const hasDateFrom = filters.dateRange?.from instanceof Date;
  const hasDateTo = filters.dateRange?.to instanceof Date;
  return hasDateFrom || hasDateTo;
};

const matchesAgeRange = (value, range = {}) => {
  if (typeof value !== "number") {
    return false;
  }

  if (typeof range.min === "number" && value < range.min) {
    return false;
  }
  if (typeof range.max === "number" && value > range.max) {
    return false;
  }
  return true;
};

const matchesDateRange = (dateValue, range = {}) => {
  if (!range.from && !range.to) {
    return true;
  }
  if (typeof dateValue !== "number") {
    return false;
  }
  if (range.from && dateValue < range.from.getTime()) {
    return false;
  }
  if (range.to && dateValue > range.to.getTime()) {
    return false;
  }
  return true;
};

const recordPassesPostFilters = (entry, searchLower, phoneQuery, filters) => {
  const hasSearch = Boolean(searchLower);

  if (hasSearch) {
    const nameMatches = entry.__customerNameLower.includes(searchLower);
    const phoneMatches = entry.__phoneNormalized.includes(phoneQuery);
    if (!nameMatches && !phoneMatches) {
      return false;
    }
  }

  if (
    (typeof filters.age?.min === "number" ||
      typeof filters.age?.max === "number") &&
    !matchesAgeRange(entry.Age, filters.age)
  ) {
    return false;
  }

  if (!matchesDateRange(entry.__dateValue, filters.dateRange)) {
    return false;
  }

  return true;
};

const sliceByIndices = (indices, dataset, offset, limit) => {
  const selection = indices.slice(offset, offset + limit);
  return selection.map((index) => dataset[index]);
};

const getSales = ({ searchTerm, filters = {}, sort, pagination }) => {
  const { dataset, indexes, sorts, positions } = getSalesStore();
  const { page, limit } = safePagination(pagination);
  const offset = (page - 1) * limit;

  const normalizedSort = normalizeSort(sort || {});
  const sortKey = `${normalizedSort.by}:${normalizedSort.order}`;
  const sortedIndices = sorts[sortKey] || sorts["date:desc"];
  const positionLookup = positions[sortKey] || positions["date:desc"];

  const candidateSet = buildCandidateSet(filters, indexes);
  const requiresPostFiltering = needsPostFilters(filters, searchTerm);

  if (!requiresPostFiltering) {
    if (!candidateSet) {
      const total = dataset.length;
      const items = sliceByIndices(sortedIndices, dataset, offset, limit);
      return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        items,
      };
    }

    const orderedCandidates = Array.from(candidateSet).sort(
      (a, b) => positionLookup[a] - positionLookup[b]
    );
    const total = orderedCandidates.length;
    const items = sliceByIndices(orderedCandidates, dataset, offset, limit);

    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items,
    };
  }

  const searchRaw = searchTerm ? searchTerm.trim() : "";
  const searchLower = searchRaw.toLowerCase();
  const phoneQuery = searchRaw.replace(/\s+/g, "");

  const indicesToScan = candidateSet
    ? Array.from(candidateSet).sort(
        (a, b) => positionLookup[a] - positionLookup[b]
      )
    : sortedIndices;

  const items = [];
  let matchedCount = 0;

  for (let idx = 0; idx < indicesToScan.length; idx += 1) {
    const recordIndex = indicesToScan[idx];
    const entry = dataset[recordIndex];

    if (!recordPassesPostFilters(entry, searchLower, phoneQuery, filters)) {
      continue;
    }

    if (matchedCount >= offset && items.length < limit) {
      items.push(entry);
    }

    matchedCount += 1;

    if (items.length === limit && matchedCount >= offset + limit) {
      break;
    }
  }

  return {
    page,
    limit,
    total: matchedCount,
    totalPages: Math.max(1, Math.ceil(matchedCount / limit) || 1),
    items,
  };
};

const getSalesMeta = () => {
  const { indexes } = getSalesStore();
  const serialize = (map) => Array.from(map.keys()).filter(Boolean).sort();

  return {
    regions: serialize(indexes.region),
    genders: serialize(indexes.gender),
    productCategories: serialize(indexes.productCategory),
    paymentMethods: serialize(indexes.paymentMethod),
    tags: serialize(indexes.tags),
  };
};

module.exports = {
  getSales,
  getSalesMeta,
};

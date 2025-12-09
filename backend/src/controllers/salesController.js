const salesService = require("../services/salesService");

const parseCommaSeparatedList = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseNullableNumber = (value) => {
  if (value === undefined) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const parseNullableDate = (value) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

exports.getSales = (req, res, next) => {
  try {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      productCategories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const filters = {
      regions: parseCommaSeparatedList(regions),
      genders: parseCommaSeparatedList(genders),
      productCategories: parseCommaSeparatedList(productCategories),
      tags: parseCommaSeparatedList(tags),
      paymentMethods: parseCommaSeparatedList(paymentMethods),
      age: {
        min: parseNullableNumber(ageMin),
        max: parseNullableNumber(ageMax),
      },
      dateRange: {
        from: parseNullableDate(dateFrom),
        to: parseNullableDate(dateTo),
      },
    };

    const sort = {
      by: sortBy,
      order: sortOrder,
    };

    const pagination = {
      page: parseNullableNumber(page) || 1,
      limit: parseNullableNumber(limit),
    };

    const response = salesService.getSales({
      searchTerm: search,
      filters,
      sort,
      pagination,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getSalesMeta = (req, res, next) => {
  try {
    const response = salesService.getSalesMeta();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

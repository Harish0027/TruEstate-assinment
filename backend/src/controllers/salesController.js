const SalesModel = require("../utils/dataLoader");
// Helpers
const parseCommaSeparatedList = (value) =>
  value
    ? value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

const parseNullableNumber = (value) => {
  if (value === undefined) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const parseNullableDate = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

// GET /api/sales
exports.getSales = async (req, res, next) => {
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

    const filters = {};

    if (regions)
      filters.CustomerRegion = { $in: parseCommaSeparatedList(regions) };
    if (genders) filters.Gender = { $in: parseCommaSeparatedList(genders) };
    if (productCategories)
      filters.ProductCategory = {
        $in: parseCommaSeparatedList(productCategories),
      };
    if (tags) filters.Tags = { $in: parseCommaSeparatedList(tags) };
    if (paymentMethods)
      filters.PaymentMethod = { $in: parseCommaSeparatedList(paymentMethods) };

    if (ageMin || ageMax) {
      filters.Age = {};
      if (ageMin) filters.Age.$gte = Number(ageMin);
      if (ageMax) filters.Age.$lte = Number(ageMax);
    }

    if (dateFrom || dateTo) {
      filters.Date = {};
      if (dateFrom) filters.Date.$gte = new Date(dateFrom);
      if (dateTo) filters.Date.$lte = new Date(dateTo);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filters.$or = [
        { CustomerName: regex },
        { PhoneNumber: regex },
        { PhoneNormalized: regex },
      ];
    }

    const sortOption = {};
    if (sortBy) sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;
    else sortOption.DateValue = -1; // default sort

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [total, items] = await Promise.all([
      SalesModel.countDocuments(filters),
      SalesModel.find(filters).sort(sortOption).skip(skip).limit(limitNum),
    ]);
    console.log(items);
    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/sales/meta
exports.getSalesMeta = async (_req, res, next) => {
  try {
    const [regions, genders, productCategories, paymentMethods, tags] =
      await Promise.all([
        SalesModel.distinct("CustomerRegion"),
        SalesModel.distinct("Gender"),
        SalesModel.distinct("ProductCategory"),
        SalesModel.distinct("PaymentMethod"),
        SalesModel.distinct("Tags"),
      ]);

    res.status(200).json({
      regions,
      genders,
      productCategories,
      paymentMethods,
      tags,
    });
  } catch (err) {
    next(err);
  }
};

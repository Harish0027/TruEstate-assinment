// src/utils/dataLoader.js
const mongoose = require("mongoose");

// 1. Define Mongoose Schema
const salesSchema = new mongoose.Schema({
  CustomerName: String,
  CustomerNameLower: String,
  PhoneNumber: String,
  PhoneNormalized: String,
  CustomerRegion: String,
  Gender: String,
  Age: Number,
  ProductCategory: String,
  Quantity: Number,
  PaymentMethod: String,
  Tags: [String],
  Date: Date,
  DateValue: Number,
});

const SalesModel = mongoose.model("Sale", salesSchema);

// 2. Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sutarharish143_db_user:harshu01@cluster0.rxqgbmc.mongodb.net/truestate?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = SalesModel;

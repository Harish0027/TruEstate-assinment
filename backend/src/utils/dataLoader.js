// src/utils/dataLoader.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
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

async function loadData() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected (via Mongoose)");

  // Clear old data
  await SalesModel.deleteMany({});
  console.log("Cleared existing sales collection");

  const filePath = path.join(
    __dirname,
    "../data/truestate_assignment_dataset.csv"
  );
  const records = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push({
          ...row,
          CustomerNameLower: (row.CustomerName || "").toLowerCase(),
          PhoneNormalized: row.PhoneNumber
            ? row.PhoneNumber.replace(/\s+/g, "")
            : "",
          Quantity: Number(row.Quantity) || 0,
          Date: row.Date ? new Date(row.Date) : null,
          DateValue: row.Date ? new Date(row.Date).getTime() : 0,
          Tags: row.Tags ? row.Tags.split(",").map((t) => t.trim()) : [],
        });
      })
      .on("end", async () => {
        try {
          console.log("Number of records read from CSV:", records.length);

          if (records.length > 0) {
            const BATCH_SIZE = 10000;
            for (let i = 0; i < records.length; i += BATCH_SIZE) {
              const batch = records.slice(i, i + BATCH_SIZE);
              await SalesModel.insertMany(batch);
              console.log(
                `Inserted ${i + batch.length} / ${records.length} records`
              );
            }
          } else {
            console.log("No records found in CSV");
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}

loadData()
  .then(() => {
    console.log("✔ Data import complete");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(" Error loading data:", err);
    mongoose.disconnect();
  });

module.exports = SalesModel;

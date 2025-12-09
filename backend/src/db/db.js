const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://sutarharish143_db_user:harshu01@cluster0.rxqgbmc.mongodb.net/?appName=Cluster0/truestate";

let client;
let db;

async function connect() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("truestate");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    throw err;
  }
}

function getDb() {
  if (!db) throw new Error("MongoDB not initialized");
  return db;
}

module.exports = { connect, getDb };

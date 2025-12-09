const express = require("express");
const cors = require("cors");
const salesRouter = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/sales", salesRouter);

app.use((err, req, res, next) => {
  // Centralized error handler keeps API responses consistent.
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Unexpected server error",
  });
});

app.listen(PORT, () => {
  console.log(`Retail Sales API listening on port ${PORT}`);
});

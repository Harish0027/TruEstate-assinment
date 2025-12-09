const express = require("express");
const cors = require("cors");
const salesRouter = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "https://tru-harish.vercel.app", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // optional
    credentials: true, // if you want to allow cookies
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/sales", salesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));

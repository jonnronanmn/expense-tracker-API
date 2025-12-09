require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ import cors
const errorHandler = require("./errorHandler");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// ✅ Enable CORS for all origins (you can restrict to your frontend later)
app.use(cors());

app.use(express.json());

app.use(errorHandler);

app.use("/users", userRoutes);
app.use("/expense", expenseRoutes);

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error", err));

if (require.main === module) {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
}

module.exports = { app, mongoose };

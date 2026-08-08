const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// Routes
app.use("/api", taskRoutes);

// Add the error handling middleware AFTER routes
app.use(errorHandler);

module.exports = app;
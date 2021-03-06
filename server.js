const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

// handling cors
app.use(cors());
// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Defines routes

app.use("/api/users", require("./Routes/api/users"));
app.use("/api/auth", require("./Routes/api/auth"));
app.use("/api/profile", require("./Routes/api/profile"));
app.use("/api/posts", require("./Routes/api/post"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

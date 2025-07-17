const express = require("express");
const postRoutes = require("./routes/post");
const app = express();

app.use(express.json());
app.use("/api/posts", postRoutes);

module.exports = app; 

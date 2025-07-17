const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  slug: String,
});

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);


const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

// Create a new post (requires authentication)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title and category are required" });
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const post = await Post.create({
      title,
      content,
      category,
      slug,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts (with optional category filtering and pagination)
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post by ID (author only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post by ID (author only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

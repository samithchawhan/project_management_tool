const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

// Add a comment to a task
router.post("/", async (req, res) => {
  try {
    const { text, task, user } = req.body;

    if (!text || !task || !user) {
      return res.status(400).json({
        message: "Comment text, task and user are required",
      });
    }

    const comment = await Comment.create({
      text,
      task,
      user,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email");

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
});

// Get all comments for a task
router.get("/task/:taskId", async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});

module.exports = router;
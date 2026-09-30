const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create a task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      project,
      assignedTo,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      project,
      assignedTo: assignedTo || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// Get all tasks for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      assignedTo,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo =
        assignedTo || null;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

module.exports = router;
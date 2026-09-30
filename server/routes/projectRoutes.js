const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// Create a project
router.post("/", async (req, res) => {
  try {
    const { name, description, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        message: "Project name and owner are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      owner,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

// Get one project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description: description || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

module.exports = router;
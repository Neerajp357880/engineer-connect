import express from "express";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Job
router.post("/create", authMiddleware, async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary,
      postedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    console.error("Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      "postedBy",
      "firstName lastName email role"
    );

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});
router.put("/apply/:jobId", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
      });
    }

    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    job.applicants.push(req.user.id);

    await job.save();

    res.status(200).json({
      message: "Applied Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/applied-jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({
      applicants: req.user.id,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
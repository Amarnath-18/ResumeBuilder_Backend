import Resume from "../models/Resume.js";
import { User } from "../models/User.js";

export const createResume = async (req, res) => {
  try {
    console.log('=== CREATE RESUME REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    console.log('User ID from token:', req.userId);
    
    const { resumeData } = req.body;
    
    console.log('Extracted resumeData:', resumeData ? 'exists' : 'missing');
    console.log('Full req.body keys:', Object.keys(req.body));
    
    // Handle both possible data structures
    let dataToProcess = resumeData;
    
    // If resumeData is not found, maybe the data is sent directly
    if (!resumeData) {
      // Check if the required fields are directly in req.body
      if (req.body.title || req.body.personalInfo) {
        console.log('Using req.body directly as resume data');
        dataToProcess = req.body;
      } else {
        console.log('❌ No resume data found in either format');
        return res.status(400).json({
          success: false,
          message: "Resume data is required.",
        });
      }
    }
    
    console.log('Final dataToProcess keys:', Object.keys(dataToProcess));
    
    if (!dataToProcess) {
      console.log('❌ No resumeData found in request body');
      return res.status(400).json({
        success: false,
        message: "Resume data is required.",
      });
    }

    const {
      title,
      template = "standard",
      personalInfo,
      education = [],
      experience = [],
      skills = [],
      projects = [],
      certifications = [],
      theme = "professional",
      isPublic = false,
    } = dataToProcess;

    if (!title || !personalInfo?.fullName || !personalInfo?.email) {
      return res.status(400).json({
        success: false,
        message: "Title, full name, and email are required in personal info.",
      });
    }

    const resume = new Resume({
      user: req.userId,
      title,
      template,
      personalInfo,
      education,
      experience,
      skills,
      projects,
      certifications,
      theme,
      isPublic,
    });

    await resume.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { resumes: resume._id },
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully.",
      data: resume,
    });
  } catch (error) {
    console.error("Error in createResume:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the resume.",
    });
  }
};

// get resume
export const getResume = async (req, res) => {
  try {
    const userId = req.userId;

    const resumesOfUser = await Resume.find({ user: userId }).sort({
      updatedAt: -1,
    });

    if (resumesOfUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resumes found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resumes fetched successfully!",
      data: resumesOfUser,
    });
  } catch (error) {
    console.log("getResume error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching resumes.",
    });
  }
};

//get resume by id
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    // Make sure the resume belongs to the logged-in user
    const resume = await Resume.findOne({ _id: resumeId, user: req.userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user",
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { resumes: resumeId },
    });

    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully!",
      data: resume,
    });
  } catch (error) {
    console.error("getResumeById error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await Resume.findOneAndDelete({
      _id: resumeId,
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      data: resume,
    });
  } catch (error) {
    console.error("deleteResume error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting resume",
    });
  }
};
// Get public resume by ID (no authentication required)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    // Find resume that is public and populate user info for contact details
    const resume = await Resume.findOne({
      _id: resumeId,
      isPublic: true,
    }).populate("user", "name email");

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or not public",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public resume fetched successfully!",
      data: resume,
    });
  } catch (error) {
    console.error("getPublicResumeById error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching public resume",
    });
  }
};
import mongoose from "mongoose";

// Main resume schema
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: String,
    default: 'standard'
  },
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    summary: {
      type: String,
      trim: true
    }
  },
  // Education
  education: [{
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    date: {
      type: String, // Using string for flexibility (e.g., "2018-2022" or "May 2022")
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  // Work Experience
  experience: [{
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    date: {
      type: String, // Using string for flexibility (e.g., "2018-Present" or "Jan 2020 - Mar 2022")
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  // Skills
  skills: [{
    type: String,
    trim: true
  }],
  // Projects
  projects: [{
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    technologies: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    githubLink:{
      type:String,
      trim:true
    },
    keyHighlights:[
      {
        type:String,
        trim:true,
      }
    ]
  }],
  // Additional sections as simple arrays
  certifications: [{
    name: {
      type: String,
      trim: true
    },
    issuer: {
      type: String,
      trim: true
    },
    date: {
      type: String,
      trim: true
    }
  }],
  // Theme options - simplified
  theme: {
    type: String,
    default: 'professional'
  },  // For tracking resume status
  isPublic: {
    type: Boolean,
    default: false  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
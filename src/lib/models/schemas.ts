import mongoose, { Schema } from "mongoose";

// Hero Schema
const HeroSchema = new Schema(
  {
    greeting: { type: String, default: "HELLO, I'M" },
    name: { type: String, required: true, default: "Ranjith Kumar" },
    title: { type: String, required: true, default: "Video Editor & Graphic Designer" },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    profileImage: { type: String, required: true },
    showreelUrl: { type: String, default: "" },
    showreelThumbnail: { type: String, default: "" },
    ctaPrimaryText: { type: String, default: "Explore My Work" },
    ctaPrimaryLink: { type: String, default: "#videos" },
    ctaSecondaryText: { type: String, default: "Let's Collaborate" },
    ctaSecondaryLink: { type: String, default: "#contact" },
    experienceBadge: { type: String, default: "5+ Years Crafting Visuals" },
    projectsBadge: { type: String, default: "250+ Successful Projects" },
    availableForHire: { type: Boolean, default: true },
    statusBadge: { type: String, default: "Available for Projects & Retainers" },
    brandName: { type: String, default: "Creative Studio" },
    serviceTags: [{ type: String }],
  },
  { timestamps: true }
);

// About Schema
const AboutSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    bioParagraph1: { type: String, required: true },
    bioParagraph2: { type: String, required: true },
    quote: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 5 },
    projectsCompleted: { type: Number, default: 250 },
    happyClients: { type: Number, default: 80 },
    clientRetentionRate: { type: Number, default: 98 },
    aboutImage: { type: String, default: "" },
    creativeJourney: [
      {
        year: String,
        title: String,
        description: String,
      },
    ],
    keyStrengths: [{ type: String }],
  },
  { timestamps: true }
);

// Video Project Schema
const VideoProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Cinematic", "Reels & Shorts", "YouTube", "Commercials", "Motion Graphics", "Music Video"],
      default: "Cinematic",
    },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    duration: { type: String, default: "" },
    client: { type: String, default: "" },
    year: { type: String, default: "" },
    softwareUsed: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: String, default: "" },
  },
  { timestamps: true }
);

// Graphic Design Schema
const GraphicDesignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Logo & Branding", "Posters & Print", "Social Media", "Thumbnails", "Advertising", "Creative Artwork"],
      default: "Logo & Branding",
    },
    imageUrl: { type: String, required: true },
    client: { type: String, default: "" },
    toolsUsed: [{ type: String }],
    featured: { type: Boolean, default: false },
    aspectRatio: {
      type: String,
      enum: ["vertical", "square", "horizontal"],
      default: "square",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Service Schema
const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    icon: { type: String, default: "Film" },
    features: [{ type: String }],
    popular: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    price: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Skill Schema
const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Video Editing", "Motion Graphics", "Graphic Design", "Color Grading", "Audio & 3D"],
      default: "Video Editing",
    },
    proficiency: { type: Number, min: 0, max: 100, default: 90 },
    iconName: { type: String, default: "Video" },
    experienceYears: { type: Number, default: 3 },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Experience Schema
const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    period: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    employmentType: { type: String, default: "Full-time" },
    companyLogo: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  { timestamps: true }
);

// Education Schema
const EducationSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    department: { type: String, default: "" },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    grade: { type: String, default: "" },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Testimonial Schema
const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String, required: true },
    clientCompany: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true },
    projectRef: { type: String, default: "" },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Enquiry Schema
const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    serviceInterested: { type: String, default: "General Inquiry" },
    budget: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
  },
  { timestamps: true }
);

// Settings Schema
const SettingsSchema = new Schema(
  {
    siteTitle: { type: String, default: "Ranjith Kumar | Video Editor & Graphic Designer" },
    siteDescription: { type: String, default: "" },
    keywords: [{ type: String }],
    author: { type: String, default: "Ranjith Kumar" },
    email: { type: String, default: "contact@ranjithportfolio.com" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    behance: { type: String, default: "" },
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    dribbble: { type: String, default: "" },
    address: { type: String, default: "" },
    footerText: { type: String, default: "" },
    copyrightText: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    contactDescription: { type: String, default: "" },
    allowInquiries: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Admin User Schema
const AdminUserSchema = new Schema(
  {
    username: { type: String, default: "ranjithkumar" },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Ranjith Kumar" },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export const HeroModel = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
export const AboutModel = mongoose.models.About || mongoose.model("About", AboutSchema);
export const VideoProjectModel = mongoose.models.VideoProject || mongoose.model("VideoProject", VideoProjectSchema);
export const GraphicDesignModel = mongoose.models.GraphicDesign || mongoose.model("GraphicDesign", GraphicDesignSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
export const EducationModel = mongoose.models.Education || mongoose.model("Education", EducationSchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
export const EnquiryModel = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
export const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export const AdminUserModel = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);


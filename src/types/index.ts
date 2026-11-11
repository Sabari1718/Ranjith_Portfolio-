export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  profileImage: string;
  showreelUrl: string;
  showreelThumbnail: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  experienceBadge: string;
  projectsBadge: string;
  availableForHire: boolean;
  statusBadge: string;
  brandName?: string;
  serviceTags?: string[];
}

export interface AboutData {
  title: string;
  subtitle: string;
  bioParagraph1: string;
  bioParagraph2: string;
  quote: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  clientRetentionRate: number;
  aboutImage?: string;
  creativeJourney: {
    year: string;
    title: string;
    description: string;
  }[];
  keyStrengths: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  category: "Cinematic" | "Reels & Shorts" | "YouTube" | "Commercials" | "Motion Graphics" | "Music Video";
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  client?: string;
  year?: string;
  softwareUsed: string[];
  featured: boolean;
  order: number;
  views?: string;
  createdAt: string;
}

export interface GraphicDesign {
  id: string;
  title: string;
  description: string;
  category: "Logo & Branding" | "Posters & Print" | "Social Media" | "Thumbnails" | "Advertising" | "Creative Artwork";
  imageUrl: string;
  client?: string;
  toolsUsed: string[];
  featured: boolean;
  aspectRatio: "vertical" | "square" | "horizontal";
  order: number;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  popular: boolean;
  order: number;
  price?: string;
  imageUrl?: string;
  active?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: "Video Editing" | "Motion Graphics" | "Graphic Design" | "Color Grading" | "Audio & 3D";
  proficiency: number; // 0 to 100
  iconName: string;
  experienceYears: number;
  featured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  current: boolean;
  order: number;
  employmentType?: string;
  companyLogo?: string;
  endDate?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  department?: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description?: string;
  logoUrl?: string;
  order: number;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  avatarUrl: string;
  rating: number; // 1 to 5
  content: string;
  projectRef?: string;
  featured: boolean;
  order: number;
  active?: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceInterested: string;
  budget?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  author: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  behance: string;
  twitter?: string;
  facebook?: string;
  dribbble?: string;
  address: string;
  footerText: string;
  copyrightText?: string;
  faviconUrl?: string;
  logoUrl?: string;
  isAvailable?: boolean;
  contactDescription?: string;
  allowInquiries: boolean;
}

export interface AdminUser {
  id: string;
  username?: string;
  email: string;
  name: string;
  role: "admin";
  createdAt: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  videos: VideoProject[];
  designs: GraphicDesign[];
  services: Service[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}


import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  PortfolioData,
  HeroData,
  AboutData,
  VideoProject,
  GraphicDesign,
  Service,
  Skill,
  Experience,
  Education,
  Testimonial,
  Enquiry,
  SiteSettings,
  AdminUser,
} from "@/types";
import { initialPortfolioData } from "./initialData";
import { connectToDatabase } from "./db";
import {
  HeroModel,
  AboutModel,
  VideoProjectModel,
  GraphicDesignModel,
  ServiceModel,
  SkillModel,
  ExperienceModel,
  EducationModel,
  TestimonialModel,
  EnquiryModel,
  SettingsModel,
  AdminUserModel,
} from "./models/schemas";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "portfolio-db.json");

interface LocalStoreShape {
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
  enquiries: Enquiry[];
  admin: {
    username?: string;
    email: string;
    passwordHash: string;
    name: string;
  };
}

function ensureDataFile(): LocalStoreShape {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultAdminUsername = process.env.ADMIN_USERNAME || "ranjithkumar";
    const defaultAdminEmail = process.env.ADMIN_EMAIL || "admin@ranjithportfolio.com";
    const defaultAdminPass = process.env.ADMIN_PASSWORD || "ranjith@1718";
    const passwordHash = bcrypt.hashSync(defaultAdminPass, 10);

    const initialData: LocalStoreShape = {
      ...initialPortfolioData,
      enquiries: [
        {
          id: "enq-sample-1",
          name: "Alexander Vance",
          email: "alex@apexcreatives.com",
          phone: "+1 555-0199",
          serviceInterested: "Commercial Video Campaign",
          budget: "$2,000 - $5,000",
          message: "Hi Ranjith Kumar, we loved your Apex Urban commercial work. We have a new fitness apparel line launching next month and would like you to lead video editing and social cuts.",
          status: "unread",
          createdAt: new Date().toISOString(),
        },
      ],
      admin: {
        username: defaultAdminUsername,
        email: defaultAdminEmail,
        passwordHash,
        name: "Ranjith Kumar (Admin)",
      },
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.admin?.username) {
      parsed.admin = {
        ...parsed.admin,
        username: process.env.ADMIN_USERNAME || "ranjithkumar",
      };
    }
    return parsed;
  } catch (err) {
    console.error("Error reading JSON db, restoring initial:", err);
    return {
      ...initialPortfolioData,
      enquiries: [],
      admin: {
        username: process.env.ADMIN_USERNAME || "ranjithkumar",
        email: process.env.ADMIN_EMAIL || "admin@ranjithportfolio.com",
        passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "ranjith@1718", 10),
        name: "Ranjith Kumar (Admin)",
      },
    };
  }
}

function writeDataFile(data: LocalStoreShape): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to portfolio-db.json:", err);
  }
}

// ------------------- PORTFOLIO OVERVIEW -------------------
export async function getPortfolioData(): Promise<PortfolioData> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const hero = await HeroModel.findOne().lean();
      const about = await AboutModel.findOne().lean();
      const videos = await VideoProjectModel.find().sort({ order: 1, createdAt: -1 }).lean();
      const designs = await GraphicDesignModel.find().sort({ order: 1, createdAt: -1 }).lean();
      const services = await ServiceModel.find().sort({ order: 1 }).lean();
      const skills = await SkillModel.find().sort({ order: 1 }).lean();
      const experience = await ExperienceModel.find().sort({ order: 1 }).lean();
      const education = await EducationModel.find().sort({ order: 1, createdAt: -1 }).lean();
      const testimonials = await TestimonialModel.find().sort({ order: 1 }).lean();
      const settings = await SettingsModel.findOne().lean();

      // If mongo collection is empty, seed it once from initialPortfolioData
      if (!hero) {
        await seedMongoDatabase();
        return initialPortfolioData;
      }

      return {
        hero: (hero as unknown as HeroData) || initialPortfolioData.hero,
        about: (about as unknown as AboutData) || initialPortfolioData.about,
        videos: (videos.map((v) => ({ ...v, id: v._id.toString() })) as unknown as VideoProject[]) || initialPortfolioData.videos,
        designs: (designs.map((d) => ({ ...d, id: d._id.toString() })) as unknown as GraphicDesign[]) || initialPortfolioData.designs,
        services: (services.map((s) => ({ ...s, id: s._id.toString() })) as unknown as Service[]) || initialPortfolioData.services,
        skills: (skills.map((sk) => ({ ...sk, id: sk._id.toString() })) as unknown as Skill[]) || initialPortfolioData.skills,
        experience: (experience.map((e) => ({ ...e, id: e._id.toString() })) as unknown as Experience[]) || initialPortfolioData.experience,
        education: (education.map((ed) => ({ ...ed, id: ed._id.toString() })) as unknown as Education[]) || initialPortfolioData.education,
        testimonials: (testimonials.map((t) => ({ ...t, id: t._id.toString() })) as unknown as Testimonial[]) || initialPortfolioData.testimonials,
        settings: (settings as unknown as SiteSettings) || initialPortfolioData.settings,
      };
    } catch (e) {
      console.warn("Failed fetching from Mongo, using disk store:", e);
    }
  }

  const local = ensureDataFile();
  return {
    hero: local.hero || initialPortfolioData.hero,
    about: local.about || initialPortfolioData.about,
    videos: local.videos || initialPortfolioData.videos,
    designs: local.designs || initialPortfolioData.designs,
    services: local.services || initialPortfolioData.services,
    skills: local.skills || initialPortfolioData.skills,
    experience: local.experience || initialPortfolioData.experience,
    education: local.education || initialPortfolioData.education,
    testimonials: local.testimonials || initialPortfolioData.testimonials,
    settings: local.settings || initialPortfolioData.settings,
  };
}

async function seedMongoDatabase() {
  await HeroModel.create(initialPortfolioData.hero);
  await AboutModel.create(initialPortfolioData.about);
  await VideoProjectModel.insertMany(initialPortfolioData.videos);
  await GraphicDesignModel.insertMany(initialPortfolioData.designs);
  await ServiceModel.insertMany(initialPortfolioData.services);
  await SkillModel.insertMany(initialPortfolioData.skills);
  await ExperienceModel.insertMany(initialPortfolioData.experience);
  await EducationModel.insertMany(initialPortfolioData.education);
  await TestimonialModel.insertMany(initialPortfolioData.testimonials);
  await SettingsModel.create(initialPortfolioData.settings);
}

// ------------------- HERO -------------------
export async function getHero(): Promise<HeroData> {
  const data = await getPortfolioData();
  return data.hero;
}

export async function updateHero(hero: Partial<HeroData>): Promise<HeroData> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await HeroModel.findOneAndUpdate({}, { $set: hero }, { new: true, upsert: true }).lean();
      return updated as unknown as HeroData;
    } catch (e) {
      console.warn("Mongo updateHero error:", e);
    }
  }

  const local = ensureDataFile();
  local.hero = { ...local.hero, ...hero };
  writeDataFile(local);
  return local.hero;
}

// ------------------- ABOUT -------------------
export async function getAbout(): Promise<AboutData> {
  const data = await getPortfolioData();
  return data.about;
}

export async function updateAbout(about: Partial<AboutData>): Promise<AboutData> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await AboutModel.findOneAndUpdate({}, { $set: about }, { new: true, upsert: true }).lean();
      return updated as unknown as AboutData;
    } catch (e) {
      console.warn("Mongo updateAbout error:", e);
    }
  }

  const local = ensureDataFile();
  local.about = { ...local.about, ...about };
  writeDataFile(local);
  return local.about;
}

// ------------------- VIDEOS -------------------
export async function getVideos(): Promise<VideoProject[]> {
  const data = await getPortfolioData();
  return data.videos;
}

export async function createVideo(video: Omit<VideoProject, "id" | "createdAt">): Promise<VideoProject> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await VideoProjectModel.create(video);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createVideo error:", e);
    }
  }

  const local = ensureDataFile();
  const newVideo: VideoProject = {
    ...video,
    id: "vid-" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  local.videos.unshift(newVideo);
  writeDataFile(local);
  return newVideo;
}

export async function updateVideo(id: string, video: Partial<VideoProject>): Promise<VideoProject | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await VideoProjectModel.findByIdAndUpdate(id, { $set: video }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as VideoProject;
    } catch (e) {
      console.warn("Mongo updateVideo error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.videos.findIndex((v) => v.id === id);
  if (index === -1) return null;
  local.videos[index] = { ...local.videos[index], ...video };
  writeDataFile(local);
  return local.videos[index];
}

export async function deleteVideo(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await VideoProjectModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteVideo error:", e);
    }
  }

  const local = ensureDataFile();
  local.videos = local.videos.filter((v) => v.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- GRAPHIC DESIGNS -------------------
export async function getDesigns(): Promise<GraphicDesign[]> {
  const data = await getPortfolioData();
  return data.designs;
}

export async function createDesign(design: Omit<GraphicDesign, "id" | "createdAt">): Promise<GraphicDesign> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await GraphicDesignModel.create(design);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createDesign error:", e);
    }
  }

  const local = ensureDataFile();
  const newDesign: GraphicDesign = {
    ...design,
    id: "des-" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  local.designs.unshift(newDesign);
  writeDataFile(local);
  return newDesign;
}

export async function updateDesign(id: string, design: Partial<GraphicDesign>): Promise<GraphicDesign | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await GraphicDesignModel.findByIdAndUpdate(id, { $set: design }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as GraphicDesign;
    } catch (e) {
      console.warn("Mongo updateDesign error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.designs.findIndex((d) => d.id === id);
  if (index === -1) return null;
  local.designs[index] = { ...local.designs[index], ...design };
  writeDataFile(local);
  return local.designs[index];
}

export async function deleteDesign(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await GraphicDesignModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteDesign error:", e);
    }
  }

  const local = ensureDataFile();
  local.designs = local.designs.filter((d) => d.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- SERVICES -------------------
export async function getServices(): Promise<Service[]> {
  const data = await getPortfolioData();
  return data.services;
}

export async function createService(service: Omit<Service, "id">): Promise<Service> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await ServiceModel.create(service);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createService error:", e);
    }
  }

  const local = ensureDataFile();
  const newService: Service = {
    ...service,
    id: "srv-" + Date.now(),
  };
  local.services.push(newService);
  writeDataFile(local);
  return newService;
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await ServiceModel.findByIdAndUpdate(id, { $set: service }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as Service;
    } catch (e) {
      console.warn("Mongo updateService error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  local.services[index] = { ...local.services[index], ...service };
  writeDataFile(local);
  return local.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ServiceModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteService error:", e);
    }
  }

  const local = ensureDataFile();
  local.services = local.services.filter((s) => s.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- SKILLS -------------------
export async function getSkills(): Promise<Skill[]> {
  const data = await getPortfolioData();
  return data.skills;
}

export async function createSkill(skill: Omit<Skill, "id">): Promise<Skill> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await SkillModel.create(skill);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createSkill error:", e);
    }
  }

  const local = ensureDataFile();
  const newSkill: Skill = {
    ...skill,
    id: "sk-" + Date.now(),
  };
  local.skills.push(newSkill);
  writeDataFile(local);
  return newSkill;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await SkillModel.findByIdAndUpdate(id, { $set: skill }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as Skill;
    } catch (e) {
      console.warn("Mongo updateSkill error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.skills.findIndex((s) => s.id === id);
  if (index === -1) return null;
  local.skills[index] = { ...local.skills[index], ...skill };
  writeDataFile(local);
  return local.skills[index];
}

export async function deleteSkill(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await SkillModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteSkill error:", e);
    }
  }

  const local = ensureDataFile();
  local.skills = local.skills.filter((s) => s.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- EXPERIENCE -------------------
export async function getExperience(): Promise<Experience[]> {
  const data = await getPortfolioData();
  return data.experience;
}

export async function createExperience(exp: Omit<Experience, "id">): Promise<Experience> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await ExperienceModel.create(exp);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createExperience error:", e);
    }
  }

  const local = ensureDataFile();
  const newExp: Experience = {
    ...exp,
    id: "exp-" + Date.now(),
  };
  local.experience.unshift(newExp);
  writeDataFile(local);
  return newExp;
}

export async function updateExperience(id: string, exp: Partial<Experience>): Promise<Experience | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await ExperienceModel.findByIdAndUpdate(id, { $set: exp }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as Experience;
    } catch (e) {
      console.warn("Mongo updateExperience error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.experience.findIndex((e) => e.id === id);
  if (index === -1) return null;
  local.experience[index] = { ...local.experience[index], ...exp };
  writeDataFile(local);
  return local.experience[index];
}

export async function deleteExperience(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ExperienceModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteExperience error:", e);
    }
  }

  const local = ensureDataFile();
  local.experience = local.experience.filter((e) => e.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- EDUCATION -------------------
export async function getEducation(): Promise<Education[]> {
  const data = await getPortfolioData();
  return data.education || [];
}

export async function createEducation(edu: Omit<Education, "id">): Promise<Education> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await EducationModel.create(edu);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createEducation error:", e);
    }
  }

  const local = ensureDataFile();
  if (!local.education) {
    local.education = [];
  }
  const newEdu: Education = {
    ...edu,
    id: "edu-" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  local.education.unshift(newEdu);
  writeDataFile(local);
  return newEdu;
}

export async function updateEducation(id: string, edu: Partial<Education>): Promise<Education | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await EducationModel.findByIdAndUpdate(id, { $set: edu }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as Education;
    } catch (e) {
      console.warn("Mongo updateEducation error:", e);
    }
  }

  const local = ensureDataFile();
  if (!local.education) {
    local.education = [];
  }
  const index = local.education.findIndex((e) => e.id === id);
  if (index === -1) return null;
  local.education[index] = { ...local.education[index], ...edu };
  writeDataFile(local);
  return local.education[index];
}

export async function deleteEducation(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await EducationModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteEducation error:", e);
    }
  }

  const local = ensureDataFile();
  if (!local.education) {
    local.education = [];
  }
  local.education = local.education.filter((e) => e.id !== id);
  writeDataFile(local);
  return true;
}

export async function reorderEducation(orderedIds: string[]): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index + 1 } },
        },
      }));
      await EducationModel.bulkWrite(bulkOps);
    } catch (e) {
      console.warn("Mongo reorderEducation error:", e);
    }
  }

  const local = ensureDataFile();
  if (local.education) {
    const idMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    local.education = local.education.map((item) => {
      if (idMap.has(item.id)) {
        return { ...item, order: idMap.get(item.id)! };
      }
      return item;
    });
    local.education.sort((a, b) => a.order - b.order);
    writeDataFile(local);
  }
  return true;
}

// ------------------- TESTIMONIALS -------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await getPortfolioData();
  return data.testimonials;
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id">): Promise<Testimonial> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await TestimonialModel.create(testimonial);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createTestimonial error:", e);
    }
  }

  const local = ensureDataFile();
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: "test-" + Date.now(),
  };
  local.testimonials.push(newTestimonial);
  writeDataFile(local);
  return newTestimonial;
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await TestimonialModel.findByIdAndUpdate(id, { $set: testimonial }, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() } as unknown as Testimonial;
    } catch (e) {
      console.warn("Mongo updateTestimonial error:", e);
    }
  }

  const local = ensureDataFile();
  const index = local.testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  local.testimonials[index] = { ...local.testimonials[index], ...testimonial };
  writeDataFile(local);
  return local.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await TestimonialModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteTestimonial error:", e);
    }
  }

  const local = ensureDataFile();
  local.testimonials = local.testimonials.filter((t) => t.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- SETTINGS -------------------
export async function getSettings(): Promise<SiteSettings> {
  const data = await getPortfolioData();
  return data.settings;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await SettingsModel.findOneAndUpdate({}, { $set: settings }, { new: true, upsert: true }).lean();
      return updated as unknown as SiteSettings;
    } catch (e) {
      console.warn("Mongo updateSettings error:", e);
    }
  }

  const local = ensureDataFile();
  local.settings = { ...local.settings, ...settings };
  writeDataFile(local);
  return local.settings;
}

// ------------------- CONTACT ENQUIRIES -------------------
export async function getEnquiries(): Promise<Enquiry[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const enquiries = await EnquiryModel.find().sort({ createdAt: -1 }).lean();
      return enquiries.map((e) => ({ ...e, id: e._id.toString() })) as unknown as Enquiry[];
    } catch (e) {
      console.warn("Mongo getEnquiries error:", e);
    }
  }

  const local = ensureDataFile();
  return local.enquiries || [];
}

export async function createEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "status">): Promise<Enquiry> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await EnquiryModel.create(enquiry);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn("Mongo createEnquiry error:", e);
    }
  }

  const local = ensureDataFile();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: "enq-" + Date.now(),
    status: "unread",
    createdAt: new Date().toISOString(),
  };
  if (!local.enquiries) local.enquiries = [];
  local.enquiries.unshift(newEnquiry);
  writeDataFile(local);
  return newEnquiry;
}

export async function updateEnquiryStatus(id: string, status: "unread" | "read" | "replied"): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await EnquiryModel.findByIdAndUpdate(id, { $set: { status } });
      return true;
    } catch (e) {
      console.warn("Mongo updateEnquiryStatus error:", e);
    }
  }

  const local = ensureDataFile();
  if (!local.enquiries) return false;
  const enq = local.enquiries.find((e) => e.id === id);
  if (!enq) return false;
  enq.status = status;
  writeDataFile(local);
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await EnquiryModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("Mongo deleteEnquiry error:", e);
    }
  }

  const local = ensureDataFile();
  if (!local.enquiries) return false;
  local.enquiries = local.enquiries.filter((e) => e.id !== id);
  writeDataFile(local);
  return true;
}

// ------------------- ADMIN AUTH -------------------
export async function verifyAdminCredentials(loginIdentifier: string, passwordPlain: string): Promise<AdminUser | null> {
  const cleanId = (loginIdentifier || "").trim();
  const db = await connectToDatabase();
  if (db) {
    try {
      const admin = await AdminUserModel.findOne({
        $or: [
          { email: cleanId.toLowerCase() },
          { username: cleanId.toLowerCase() },
          { email: cleanId },
          { username: cleanId },
        ],
      }).lean();
      if (admin && bcrypt.compareSync(passwordPlain, admin.passwordHash)) {
        return {
          id: admin._id.toString(),
          username: admin.username || "ranjithkumar",
          email: admin.email,
          name: admin.name || "Ranjith Kumar (Admin)",
          role: "admin",
          createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("Mongo verifyAdmin error:", e);
    }
  }

  const local = ensureDataFile();
  if (local.admin) {
    const emailMatch = local.admin.email.toLowerCase() === cleanId.toLowerCase();
    const usernameMatch = local.admin.username?.toLowerCase() === cleanId.toLowerCase();
    const defaultAlias = cleanId.toLowerCase() === "ranjithkumar" || cleanId.toLowerCase() === "admin@ranjithportfolio.com";

    if (emailMatch || usernameMatch || defaultAlias) {
      const isMatch = bcrypt.compareSync(passwordPlain, local.admin.passwordHash);
      if (isMatch) {
        return {
          id: "admin-root",
          username: local.admin.username || "ranjithkumar",
          email: local.admin.email,
          name: local.admin.name || "Ranjith Kumar (Admin)",
          role: "admin",
          createdAt: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}

export async function changeAdminPassword(
  loginIdentifier: string,
  currentPasswordPlain: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPasswordPlain || newPasswordPlain.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long" };
  }

  // 1. Verify current credentials
  const verified = await verifyAdminCredentials(loginIdentifier, currentPasswordPlain);
  if (!verified) {
    return { success: false, error: "Current password is incorrect" };
  }

  // 2. Hash new password
  const newPasswordHash = bcrypt.hashSync(newPasswordPlain, 10);

  // 3. Update in MongoDB
  const db = await connectToDatabase();
  if (db) {
    try {
      await AdminUserModel.updateMany(
        {
          $or: [
            { email: verified.email },
            { username: verified.username },
            { role: "admin" },
          ],
        },
        { $set: { passwordHash: newPasswordHash } }
      );
    } catch (e) {
      console.warn("Mongo changeAdminPassword error:", e);
    }
  }

  // 4. Update in local storage
  const local = ensureDataFile();
  if (local.admin) {
    local.admin.passwordHash = newPasswordHash;
    writeDataFile(local);
  }

  return { success: true };
}

export async function updateAdminCredentials(
  currentEmail: string,
  newEmail?: string,
  newPasswordPlain?: string,
  newName?: string,
  newUsername?: string
): Promise<boolean> {
  const db = await connectToDatabase();
  const updates: Record<string, unknown> = {};
  if (newEmail) updates.email = newEmail;
  if (newUsername) updates.username = newUsername;
  if (newName) updates.name = newName;
  if (newPasswordPlain) updates.passwordHash = bcrypt.hashSync(newPasswordPlain, 10);

  if (db) {
    try {
      await AdminUserModel.findOneAndUpdate({ email: currentEmail }, { $set: updates }, { upsert: true });
    } catch (e) {
      console.warn("Mongo updateAdmin error:", e);
    }
  }

  const local = ensureDataFile();
  if (local.admin) {
    if (newEmail) local.admin.email = newEmail;
    if (newUsername) local.admin.username = newUsername;
    if (newName) local.admin.name = newName;
    if (newPasswordPlain) local.admin.passwordHash = bcrypt.hashSync(newPasswordPlain, 10);
    writeDataFile(local);
  }

  return true;
}


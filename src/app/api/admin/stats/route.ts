import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getPortfolioData, getEnquiries } from "@/lib/storage";
import { isMongoConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getPortfolioData();
    const enquiries = await getEnquiries();

    const unreadEnquiries = enquiries.filter((e) => e.status === "unread").length;
    const featuredVideos = data.videos.filter((v) => v.featured).length;
    const featuredDesigns = data.designs.filter((d) => d.featured).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalVideos: data.videos.length,
        featuredVideos,
        totalDesigns: data.designs.length,
        featuredDesigns,
        totalServices: data.services.length,
        totalSkills: data.skills.length,
        totalExperience: data.experience.length,
        totalEducation: data.education?.length || 0,
        totalTestimonials: data.testimonials.length,
        totalEnquiries: enquiries.length,
        unreadEnquiries,
        storageMode: isMongoConfigured() ? "MongoDB Atlas / Database" : "Resilient JSON Local Engine",
      },
      recentEnquiries: enquiries.slice(0, 5),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to load stats" }, { status: 500 });
  }
}


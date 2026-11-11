import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getSkills, createSkill } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const skills = await getSkills();
  return NextResponse.json({ success: true, data: skills });
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, proficiency, iconName, experienceYears, featured, order } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Skill name is required" }, { status: 400 });
    }

    const newSkill = await createSkill({
      name,
      category: category || "Video Editing",
      proficiency: Number(proficiency) || 85,
      iconName: iconName || "Video",
      experienceYears: Number(experienceYears) || 3,
      featured: Boolean(featured),
      order: Number(order) || 0,
    });

    return NextResponse.json({ success: true, message: "Skill created", data: newSkill });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json({ success: false, error: "Failed to create skill" }, { status: 500 });
  }
}


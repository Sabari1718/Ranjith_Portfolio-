import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getSkills, createSkill } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const skills = await getSkills();
  return NextResponse.json(
    { success: true, data: skills },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, proficiency, iconName, experienceYears, featured, order } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Skill name is required" }, { status: 400 });
    }

    const newSkill = await createSkill({
      name: name.trim(),
      category: category || "Video Editing",
      proficiency: Math.min(100, Math.max(0, Number(proficiency) || 85)),
      iconName: iconName || "Video",
      experienceYears: Math.max(1, Number(experienceYears) || 3),
      featured: featured !== undefined ? Boolean(featured) : true,
      order: Number(order) || 0,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/skills");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Skill created successfully",
      data: newSkill,
    });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json({ success: false, error: "Failed to create skill" }, { status: 500 });
  }
}

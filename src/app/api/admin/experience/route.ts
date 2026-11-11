import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getExperience, createExperience } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const experience = await getExperience();
  return NextResponse.json(
    { success: true, data: experience },
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
    const { role, company, companyLogo, location, period, description, highlights, current, order, employmentType, endDate } = body;

    if (!role || !company) {
      return NextResponse.json({ success: false, error: "Role and Company are required" }, { status: 400 });
    }

    const newExp = await createExperience({
      role,
      company,
      companyLogo: companyLogo || "",
      location: location || "Remote",
      period: period || "2023 - Present",
      description: description || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      current: Boolean(current),
      order: Number(order) || 0,
      employmentType: employmentType || "Contract / Freelance",
      endDate: endDate || "",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/experience");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Experience record created", data: newExp });
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json({ success: false, error: "Failed to create experience" }, { status: 500 });
  }
}

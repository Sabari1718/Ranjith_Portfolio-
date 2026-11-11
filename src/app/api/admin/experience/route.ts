import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getExperience, createExperience } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const experience = await getExperience();
  return NextResponse.json({ success: true, data: experience });
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { role, company, location, period, description, highlights, current, order, employmentType, companyLogo, endDate } = body;

    if (!role || !company) {
      return NextResponse.json(
        { success: false, error: "Role and company are required" },
        { status: 400 }
      );
    }

    const calculatedPeriod = period || (current ? "Present" : "Past");

    const newExp = await createExperience({
      role,
      company,
      location: location || "",
      period: calculatedPeriod,
      description: description || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      current: Boolean(current),
      order: Number(order) || 0,
      employmentType: employmentType || "Full-time",
      companyLogo: companyLogo || "",
      endDate: endDate || "",
    });

    return NextResponse.json({ success: true, message: "Experience created", data: newExp });
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json({ success: false, error: "Failed to create experience" }, { status: 500 });
  }
}

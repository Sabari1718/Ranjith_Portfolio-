import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getEducation, createEducation, reorderEducation } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const education = await getEducation();
  return NextResponse.json({ success: true, data: education });
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      institution,
      degree,
      department,
      startYear,
      endYear,
      grade,
      description,
      logoUrl,
      order,
    } = body;

    if (!institution || !degree || !startYear || !endYear) {
      return NextResponse.json(
        { success: false, error: "Institution, Degree, Start Year, and End Year are required" },
        { status: 400 }
      );
    }

    const newEdu = await createEducation({
      institution: institution.trim(),
      degree: degree.trim(),
      department: department?.trim() || "",
      startYear: startYear.trim(),
      endYear: endYear.trim(),
      grade: grade?.trim() || "",
      description: description?.trim() || "",
      logoUrl: logoUrl?.trim() || "",
      order: Number(order) || 0,
    });

    return NextResponse.json({ success: true, message: "Education record added successfully", data: newEdu });
  } catch (error) {
    console.error("Create education error:", error);
    return NextResponse.json({ success: false, error: "Failed to create education entry" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, error: "orderedIds array is required" }, { status: 400 });
    }

    await reorderEducation(orderedIds);
    const updatedList = await getEducation();
    return NextResponse.json({ success: true, message: "Education reordered successfully", data: updatedList });
  } catch (error) {
    console.error("Reorder education error:", error);
    return NextResponse.json({ success: false, error: "Failed to reorder education" }, { status: 500 });
  }
}


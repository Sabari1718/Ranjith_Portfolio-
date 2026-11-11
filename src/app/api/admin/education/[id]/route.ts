import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateEducation, deleteEducation, getEducation } from "@/lib/storage";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const all = await getEducation();
  const entry = all.find((item) => item.id === params.id);
  if (!entry) {
    return NextResponse.json({ success: false, error: "Education record not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: entry });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateEducation(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Education record not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Education record updated successfully", data: updated });
  } catch (error) {
    console.error("Update education error:", error);
    return NextResponse.json({ success: false, error: "Failed to update education record" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteEducation(params.id);
    return NextResponse.json({ success, message: "Education record deleted successfully" });
  } catch (error) {
    console.error("Delete education error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete education record" }, { status: 500 });
  }
}


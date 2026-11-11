import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateExperience, deleteExperience } from "@/lib/storage";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateExperience(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Experience updated", data: updated });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json({ success: false, error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteExperience(params.id);
    return NextResponse.json({ success, message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete experience" }, { status: 500 });
  }
}


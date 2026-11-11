import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateDesign, deleteDesign } from "@/lib/storage";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateDesign(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Design updated", data: updated });
  } catch (error) {
    console.error("Update design error:", error);
    return NextResponse.json({ success: false, error: "Failed to update design" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteDesign(params.id);
    return NextResponse.json({ success, message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete design error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete design" }, { status: 500 });
  }
}


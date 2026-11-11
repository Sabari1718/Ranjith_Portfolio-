import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateVideo, deleteVideo } from "@/lib/storage";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateVideo(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Video updated", data: updated });
  } catch (error) {
    console.error("Update video error:", error);
    return NextResponse.json({ success: false, error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteVideo(params.id);
    return NextResponse.json({ success, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete video" }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { updateVideo, deleteVideo } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateVideo(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Video project not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/videos");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Video project updated", data: updated });
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
    try {
      revalidatePath("/");
      revalidatePath("/admin/videos");
      revalidatePath("/api/portfolio");
    } catch {}
    return NextResponse.json({ success, message: "Video project deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete video" }, { status: 500 });
  }
}

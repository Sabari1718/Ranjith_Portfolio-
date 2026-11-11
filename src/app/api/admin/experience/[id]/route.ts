import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { updateExperience, deleteExperience } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateExperience(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Experience record not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/experience");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Experience record updated", data: updated });
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
    try {
      revalidatePath("/");
      revalidatePath("/admin/experience");
      revalidatePath("/api/portfolio");
    } catch {}
    return NextResponse.json({ success, message: "Experience record deleted successfully" });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete experience" }, { status: 500 });
  }
}

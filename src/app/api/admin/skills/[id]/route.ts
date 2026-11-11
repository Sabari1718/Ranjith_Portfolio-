import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { updateSkill, deleteSkill } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSkill(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Skill not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/skills");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Skill updated successfully", data: updated });
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json({ success: false, error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteSkill(params.id);
    try {
      revalidatePath("/");
      revalidatePath("/admin/skills");
      revalidatePath("/api/portfolio");
    } catch {}
    return NextResponse.json({ success, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete skill" }, { status: 500 });
  }
}

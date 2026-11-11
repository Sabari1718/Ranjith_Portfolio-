import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { updateDesign, deleteDesign } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateDesign(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Design project not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/designs");
      revalidatePath("/api/portfolio");
    } catch {}

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
    try {
      revalidatePath("/");
      revalidatePath("/admin/designs");
      revalidatePath("/api/portfolio");
    } catch {}
    return NextResponse.json({ success, message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete design error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete design" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getAbout, updateAbout } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const about = await getAbout();
  return NextResponse.json(
    { success: true, data: about },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateAbout(body);

    try {
      revalidatePath("/");
      revalidatePath("/admin/about");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "About section updated successfully", data: updated });
  } catch (error) {
    console.error("About update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update about section" }, { status: 500 });
  }
}

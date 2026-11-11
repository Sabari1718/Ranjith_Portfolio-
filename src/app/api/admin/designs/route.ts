import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getDesigns, createDesign } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const designs = await getDesigns();
  return NextResponse.json(
    { success: true, data: designs },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category, imageUrl, toolsUsed, client, aspectRatio, featured, order } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: "Title and Image URL are required" }, { status: 400 });
    }

    const newDesign = await createDesign({
      title,
      description: description || "",
      category: category || "Posters & Print",
      imageUrl,
      toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : (toolsUsed ? [toolsUsed] : ["Photoshop"]),
      client: client || "",
      aspectRatio: aspectRatio || "vertical",
      featured: Boolean(featured),
      order: Number(order) || 0,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/designs");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Design project created", data: newDesign });
  } catch (error) {
    console.error("Create design error:", error);
    return NextResponse.json({ success: false, error: "Failed to create design" }, { status: 500 });
  }
}

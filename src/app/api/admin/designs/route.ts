import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getDesigns, createDesign } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const designs = await getDesigns();
  return NextResponse.json({ success: true, data: designs });
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category, imageUrl, client, toolsUsed, featured, aspectRatio, order } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const newDesign = await createDesign({
      title,
      description: description || "",
      category: category || "Logo & Branding",
      imageUrl,
      client: client || "",
      toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : (toolsUsed ? [toolsUsed] : ["Photoshop"]),
      featured: Boolean(featured),
      aspectRatio: aspectRatio || "square",
      order: Number(order) || 0,
    });

    return NextResponse.json({ success: true, message: "Design created", data: newDesign });
  } catch (error) {
    console.error("Create design error:", error);
    return NextResponse.json({ success: false, error: "Failed to create design" }, { status: 500 });
  }
}


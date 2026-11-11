import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getAbout, updateAbout } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const about = await getAbout();
  return NextResponse.json({ success: true, data: about });
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateAbout(body);
    return NextResponse.json({ success: true, message: "About updated successfully", data: updated });
  } catch (error) {
    console.error("About update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update about" }, { status: 500 });
  }
}


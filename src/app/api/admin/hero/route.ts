import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getHero, updateHero } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const hero = await getHero();
  return NextResponse.json({ success: true, data: hero });
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateHero(body);
    return NextResponse.json({ success: true, message: "Hero updated successfully", data: updated });
  } catch (error) {
    console.error("Hero update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update hero" }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getVideos, createVideo } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const videos = await getVideos();
  return NextResponse.json(
    { success: true, data: videos },
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
    const { title, description, category, videoUrl, thumbnailUrl, softwareUsed, duration, client, year, featured, order, views } = body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return NextResponse.json(
        { success: false, error: "Title, Video URL, and Thumbnail URL are required" },
        { status: 400 }
      );
    }

    const newVideo = await createVideo({
      title,
      description: description || "",
      category: category || "Cinematic",
      videoUrl,
      thumbnailUrl,
      softwareUsed: Array.isArray(softwareUsed) ? softwareUsed : (softwareUsed ? [softwareUsed] : ["Premiere Pro"]),
      duration: duration || "",
      client: client || "",
      year: year || new Date().getFullYear().toString(),
      featured: Boolean(featured),
      order: Number(order) || 0,
      views: views || "",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/videos");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Video project created", data: newVideo });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ success: false, error: "Failed to create video" }, { status: 500 });
  }
}

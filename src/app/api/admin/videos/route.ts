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

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Video Project Title is required" },
        { status: 400 }
      );
    }

    if (!videoUrl || !videoUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Video File or Video Link is required" },
        { status: 400 }
      );
    }

    // Auto-generate or fallback thumbnail if not provided
    let finalThumbnail = thumbnailUrl && thumbnailUrl.trim() ? thumbnailUrl.trim() : "";
    if (!finalThumbnail) {
      const ytMatch = videoUrl.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
      );
      if (ytMatch && ytMatch[1]) {
        finalThumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
      } else {
        finalThumbnail = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80";
      }
    }

    const newVideo = await createVideo({
      title: title.trim(),
      description: description || "",
      category: category || "Commercials",
      videoUrl: videoUrl.trim(),
      thumbnailUrl: finalThumbnail,
      softwareUsed: Array.isArray(softwareUsed)
        ? softwareUsed
        : softwareUsed
        ? [softwareUsed]
        : ["Premiere Pro", "After Effects"],
      duration: duration || "1:00",
      client: client || "Creative Portfolio",
      year: year || new Date().getFullYear().toString(),
      featured: Boolean(featured),
      order: Number(order) || 0,
      views: views || "10K+",
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/videos");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Video project created successfully!", data: newVideo });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ success: false, error: "Failed to create video project" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getServices, createService } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const services = await getServices();
  return NextResponse.json(
    { success: true, data: services },
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
    const { title, slug, shortDescription, fullDescription, icon, features, popular, order, price, imageUrl, active } = body;

    if (!title || !shortDescription) {
      return NextResponse.json({ success: false, error: "Title and Short Description are required" }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newService = await createService({
      title,
      slug: generatedSlug,
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      icon: icon || "Video",
      features: Array.isArray(features) ? features : [],
      popular: Boolean(popular),
      order: Number(order) || 0,
      price: price || "",
      imageUrl: imageUrl || "",
      active: active !== false,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/services");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Service created", data: newService });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 });
  }
}

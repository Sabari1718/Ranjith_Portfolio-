import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getTestimonials, createTestimonial } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await getTestimonials();
  return NextResponse.json(
    { success: true, data: testimonials },
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
    const { clientName, clientRole, clientCompany, avatarUrl, rating, content, projectRef, featured, order, active } = body;

    if (!clientName || !content) {
      return NextResponse.json({ success: false, error: "Client Name and Testimonial Content are required" }, { status: 400 });
    }

    const newTestimonial = await createTestimonial({
      clientName,
      clientRole: clientRole || "Client",
      clientCompany: clientCompany || "",
      avatarUrl: avatarUrl || "",
      rating: Number(rating) || 5,
      content,
      projectRef: projectRef || "",
      featured: Boolean(featured),
      order: Number(order) || 0,
      active: active !== false,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({ success: true, message: "Testimonial created", data: newTestimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ success: false, error: "Failed to create testimonial" }, { status: 500 });
  }
}

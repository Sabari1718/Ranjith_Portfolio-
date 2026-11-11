import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getTestimonials, createTestimonial } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await getTestimonials();
  return NextResponse.json({ success: true, data: testimonials });
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
      return NextResponse.json(
        { success: false, error: "Client name and testimonial content are required" },
        { status: 400 }
      );
    }

    const newTestimonial = await createTestimonial({
      clientName,
      clientRole: clientRole || "Client",
      clientCompany: clientCompany || "",
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: Number(rating) || 5,
      content,
      projectRef: projectRef || "",
      featured: Boolean(featured),
      order: Number(order) || 0,
      active: active !== undefined ? Boolean(active) : true,
    });

    return NextResponse.json({ success: true, message: "Testimonial created", data: newTestimonial });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ success: false, error: "Failed to create testimonial" }, { status: 500 });
  }
}

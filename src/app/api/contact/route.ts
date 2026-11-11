import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceInterested, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, email, and a message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const enquiry = await createEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      serviceInterested: serviceInterested || "General Inquiry",
      budget: budget || "",
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received! Ranjith Kumar will be in touch shortly.",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}


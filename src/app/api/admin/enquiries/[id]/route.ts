import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/storage";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    if (!["unread", "read", "replied"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
    }

    const success = await updateEnquiryStatus(params.id, status);
    return NextResponse.json({ success, message: "Enquiry status updated" });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ success: false, error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await deleteEnquiry(params.id);
    return NextResponse.json({ success, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete enquiry" }, { status: 500 });
  }
}


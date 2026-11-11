import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json({ success: false, error: "Failed to load portfolio" }, { status: 500 });
  }
}

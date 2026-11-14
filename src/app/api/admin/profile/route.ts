import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminFromRequest } from "@/lib/auth";
import { getHero, updateHero, getSettings, updateSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const hero = await getHero();
    const settings = await getSettings();

    return NextResponse.json(
      {
        success: true,
        data: {
          name: hero.name,
          brandName: hero.brandName || "RANJITH KUMAR",
          profileImage: hero.profileImage,
          title: hero.title,
          greeting: hero.greeting,
          tagline: hero.tagline,
          bio: hero.bio,
          experienceBadge: hero.experienceBadge,
          projectsBadge: hero.projectsBadge,
          availableForHire: hero.availableForHire,
          statusBadge: hero.statusBadge,
          ctaPrimaryText: hero.ctaPrimaryText || "Explore My Work",
          ctaPrimaryLink: hero.ctaPrimaryLink || "#videos",
          ctaSecondaryText: hero.ctaSecondaryText || "Let's Connect",
          ctaSecondaryLink: hero.ctaSecondaryLink || "#contact",
          serviceTags: hero.serviceTags || ["Cinematic Video Editing", "Brand Identity", "Motion Graphics", "Poster Design", "Color Grading"],
          email: settings.email,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          instagram: settings.instagram,
          linkedin: settings.linkedin,
          youtube: settings.youtube,
          behance: settings.behance,
          twitter: settings.twitter || "",
          author: settings.author,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const heroUpdates = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.brandName !== undefined && { brandName: body.brandName }),
      ...(body.profileImage !== undefined && { profileImage: body.profileImage }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.greeting !== undefined && { greeting: body.greeting }),
      ...(body.tagline !== undefined && { tagline: body.tagline }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.experienceBadge !== undefined && { experienceBadge: body.experienceBadge }),
      ...(body.projectsBadge !== undefined && { projectsBadge: body.projectsBadge }),
      ...(body.availableForHire !== undefined && { availableForHire: Boolean(body.availableForHire) }),
      ...(body.statusBadge !== undefined && { statusBadge: body.statusBadge }),
      ...(body.ctaPrimaryText !== undefined && { ctaPrimaryText: body.ctaPrimaryText }),
      ...(body.ctaPrimaryLink !== undefined && { ctaPrimaryLink: body.ctaPrimaryLink }),
      ...(body.ctaSecondaryText !== undefined && { ctaSecondaryText: body.ctaSecondaryText }),
      ...(body.ctaSecondaryLink !== undefined && { ctaSecondaryLink: body.ctaSecondaryLink }),
      ...(body.serviceTags !== undefined && {
        serviceTags: Array.isArray(body.serviceTags)
          ? body.serviceTags
          : String(body.serviceTags).split(",").map((t: string) => t.trim()).filter(Boolean),
      }),
    };

    const settingsUpdates = {
      ...(body.name !== undefined && { author: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
      ...(body.instagram !== undefined && { instagram: body.instagram }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin }),
      ...(body.youtube !== undefined && { youtube: body.youtube }),
      ...(body.behance !== undefined && { behance: body.behance }),
      ...(body.twitter !== undefined && { twitter: body.twitter }),
    };

    const [updatedHero, updatedSettings] = await Promise.all([
      updateHero(heroUpdates),
      updateSettings(settingsUpdates),
    ]);

    try {
      revalidatePath("/");
      revalidatePath("/admin/profile");
      revalidatePath("/admin/hero");
      revalidatePath("/api/portfolio");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Profile and Hero details updated successfully!",
      data: {
        hero: updatedHero,
        settings: updatedSettings,
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}

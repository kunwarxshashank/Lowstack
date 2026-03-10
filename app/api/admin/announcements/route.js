import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

// Helper: check admin
async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized", status: 401 };
    if (session.user.role !== "ADMIN" && session.user.userRole !== "ADMIN")
        return { error: "Forbidden", status: 403 };
    return { session };
}

// GET — public returns active; ?all=true (admin) returns everything
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get("all") === "true";

        // If admin wants all, check session
        if (showAll) {
            const session = await getServerSession(authOptions);
            const isAdmin =
                session?.user?.role === "ADMIN" || session?.user?.userRole === "ADMIN";
            if (!isAdmin) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        const announcements = await prisma.announcement.findMany({
            where: showAll ? undefined : { active: true },
            orderBy: { order: "asc" },
        });
        return NextResponse.json(announcements);
    } catch (error) {
        console.error("GET /api/admin/announcements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST — admin only, create announcement
export async function POST(req) {
    try {
        const { error, status } = await requireAdmin();
        if (error) return NextResponse.json({ error }, { status });

        const body = await req.json();
        const { tag, text, href, tagColor, active, order } = body;

        if (!tag || !text || !href) {
            return NextResponse.json({ error: "tag, text, and href are required" }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                tag,
                text,
                href,
                tagColor: tagColor || "bg-primary/20 text-primary",
                active: active ?? true,
                order: order ?? 0,
            },
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/announcements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT — admin only, update announcement
export async function PUT(req) {
    try {
        const { error, status } = await requireAdmin();
        if (error) return NextResponse.json({ error }, { status });

        const body = await req.json();
        const { id, tag, text, href, tagColor, active, order } = body;

        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const announcement = await prisma.announcement.update({
            where: { id },
            data: { tag, text, href, tagColor, active, order },
        });

        return NextResponse.json(announcement);
    } catch (error) {
        console.error("PUT /api/admin/announcements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE — admin only
export async function DELETE(req) {
    try {
        const { error, status } = await requireAdmin();
        if (error) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        await prisma.announcement.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/admin/announcements error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json({ error: "Missing postId" }, { status: 400 });
        }

        const existingFavourite = await prisma.favourite.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: postId,
                },
            },
        });

        if (existingFavourite) {
            await prisma.favourite.delete({
                where: {
                    id: existingFavourite.id,
                },
            });
            return NextResponse.json({ message: "Removed from favourites", isFavourite: false });
        } else {
            await prisma.favourite.create({
                data: {
                    userId: session.user.id,
                    postId: postId,
                },
            });
            return NextResponse.json({ message: "Added to favourites", isFavourite: true });
        }
    } catch (error) {
        console.error("Error toggling favourite:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ isFavourite: false });
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ error: "Missing postId" }, { status: 400 });
        }

        const favourite = await prisma.favourite.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: postId,
                },
            },
        });

        return NextResponse.json({ isFavourite: !!favourite });
    } catch (error) {
        console.error("Error checking favourite status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

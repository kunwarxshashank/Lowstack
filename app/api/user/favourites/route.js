import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const favourites = await prisma.favourite.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                post: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const posts = favourites.map((f) => f.post);

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { postId, reason, description } = body;

        if (!postId || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                reason,
                description,
                postId,
                userId: session?.user?.id || null,
            },
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

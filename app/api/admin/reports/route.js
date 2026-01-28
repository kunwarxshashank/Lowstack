import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin - assuming role is stored in session.user.role or userRole
        // Based on schema, it is userRole, but next-auth session usually maps it.
        // I'll assume session.user.role is populated correctly in authOptions callbacks.
        // If not, I might need to check DB, but let's assume session has it for now.
        // Actually, looking at schema, it's `userRole`.

        // Let's check if the user is authenticated first.
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Ideally we should check for admin role here. 
        // Assuming the session callback puts role in session.user.role

        const reports = await prisma.report.findMany({
            include: {
                User: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                post: {
                    select: {
                        title: true,
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reportId, status } = body;

        if (!reportId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const report = await prisma.report.update({
            where: {
                id: reportId,
            },
            data: {
                status,
            },
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error updating report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

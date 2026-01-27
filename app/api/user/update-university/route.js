/**
 * User Update University API
 * Updates the user's selected university in their profile
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { universityId } = await req.json();

        if (!universityId) {
            return NextResponse.json(
                { error: "University ID is required" },
                { status: 400 }
            );
        }

        // Update user's selected university
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { selectedUniversity: universityId },
        });

        return NextResponse.json(
            {
                message: "University updated successfully",
                selectedUniversity: user.selectedUniversity,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating university:", error);
        return NextResponse.json(
            { error: "Failed to update university" },
            { status: 500 }
        );
    }
}

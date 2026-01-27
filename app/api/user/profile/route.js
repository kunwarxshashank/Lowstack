import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return new Response("Unauthorized", {
                status: 401,
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                university: true,
                userRole: true,
                punya: true,
            },
        });

        if (!user) {
            return new Response("User not found", {
                status: 404,
            });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return new Response("An error occurred", {
            status: 500,
        });
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return new Response("Unauthorized", {
                status: 401,
            });
        }

        const { name, avatar, university } = await req.json();

        // Validate required fields
        if (!name || !name.trim()) {
            return new Response("Name is required", {
                status: 400,
                statusText: "FAILED",
            });
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new Response("User not found", {
                status: 404,
            });
        }

        // Update the user profile - only include fields that are being changed
        const updateData = {
            name: name.trim(),
        };

        // Handle optional avatar field
        if (avatar !== undefined) {
            updateData.avatar = avatar?.trim() || null;
        }

        // Handle optional university field
        if (university !== undefined) {
            updateData.university = university?.trim() || null;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                university: true,
                userRole: true,
            },
        });

        return new Response(JSON.stringify(updatedUser), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return new Response(`An error occurred: ${error.message}`, {
            status: 500,
        });
    }
}

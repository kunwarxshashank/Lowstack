/**
 * University API Routes
 * Handles CRUD operations for universities
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prisma";

// GET - Fetch all universities or filter by query
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");
        const enabled = searchParams.get("enabled");

        let query = {};
        if (code) query.code = code;
        if (enabled !== null) query.enabled = enabled === "true";

        const universities = await prisma.university.findMany({
            where: query,
            orderBy: { name: "asc" },
        });

        return NextResponse.json(universities, { status: 200 });
    } catch (error) {
        console.error("Error fetching universities:", error);
        return NextResponse.json(
            { error: "Failed to fetch universities" },
            { status: 500 }
        );
    }
}

// POST - Create new university (admin only)
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, code, address, logo, enabled } = await req.json();

        // Validate required fields
        if (!name || !code) {
            return NextResponse.json(
                { error: "Name and code are required" },
                { status: 400 }
            );
        }

        // Check if university code already exists
        const existingUniversity = await prisma.university.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (existingUniversity) {
            return NextResponse.json(
                { error: "University code already exists" },
                { status: 409 }
            );
        }

        const university = await prisma.university.create({
            data: {
                name,
                code: code.toUpperCase(),
                address,
                logo,
                enabled: enabled !== undefined ? enabled : true,
            },
        });

        return NextResponse.json(university, { status: 201 });
    } catch (error) {
        console.error("Error creating university:", error);
        return NextResponse.json(
            { error: "Failed to create university" },
            { status: 500 }
        );
    }
}

// PUT - Update university (admin only)
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id, name, code, address, logo, enabled } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "University ID is required" },
                { status: 400 }
            );
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (code) updateData.code = code.toUpperCase();
        if (address !== undefined) updateData.address = address;
        if (logo !== undefined) updateData.logo = logo;
        if (enabled !== undefined) updateData.enabled = enabled;

        const university = await prisma.university.update({
            where: { id },
            data: updateData,
        });

        if (!university) {
            return NextResponse.json(
                { error: "University not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(university, { status: 200 });
    } catch (error) {
        console.error("Error updating university:", error);
        return NextResponse.json(
            { error: "Failed to update university" },
            { status: 500 }
        );
    }
}

// DELETE - Delete university (admin only)
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "University ID is required" },
                { status: 400 }
            );
        }

        const university = await prisma.university.delete({
            where: { id },
        });

        if (!university) {
            return NextResponse.json(
                { error: "University not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "University deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting university:", error);
        return NextResponse.json(
            { error: "Failed to delete university" },
            { status: 500 }
        );
    }
}

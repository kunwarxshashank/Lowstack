import prisma from "@/libs/prisma";

// GET - Fetch all branch configurations or a specific one
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const branchCode = searchParams.get("branch");

        if (branchCode) {
            // Fetch specific branch config
            const branchConfig = await prisma.branchConfig.findUnique({
                where: { branch_code: branchCode },
            });

            if (!branchConfig) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: "Branch not found",
                        message: `No configuration found for branch: ${branchCode}`,
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    data: branchConfig,
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Fetch all branch configs
        const allBranchConfigs = await prisma.branchConfig.findMany({
            orderBy: { branch_code: "asc" },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: allBranchConfigs,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching branch config:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// POST - Create or update branch configuration
export async function POST(req) {
    try {
        const { branch_code, branch_name, semester_count, logo } = await req.json();

        // Validate required fields
        if (!branch_code || !branch_name) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing required fields",
                    message: "branch_code and branch_name are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validate semester_count
        if (semester_count && ![4, 6, 8].includes(semester_count)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid semester count",
                    message: "semester_count must be 4, 6, or 8",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Upsert (create or update) branch config
        const branchConfig = await prisma.branchConfig.upsert({
            where: { branch_code },
            update: {
                branch_name,
                semester_count: semester_count || 8,
                logo,
            },
            create: {
                branch_code,
                branch_name,
                semester_count: semester_count || 8,
                logo,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: branchConfig,
                message: "Branch configuration saved successfully",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error saving branch config:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// PUT - Update semester count for a branch
export async function PUT(req) {
    try {
        const { branch_code, semester_count, logo } = await req.json();

        if (!branch_code || !semester_count) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing required fields",
                    message: "branch_code and semester_count are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Validate semester_count
        if (![4, 6, 8].includes(semester_count)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid semester count",
                    message: "semester_count must be 4, 6, or 8",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const branchConfig = await prisma.branchConfig.update({
            where: { branch_code },
            data: { semester_count, logo },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: branchConfig,
                message: "Semester count updated successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating branch config:", error);

        if (error.code === "P2025") {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Branch not found",
                    message: "No configuration found for the specified branch",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// DELETE - Remove branch configuration
export async function DELETE(req) {
    try {
        const { branch_code } = await req.json();

        if (!branch_code) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Missing required field",
                    message: "branch_code is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        await prisma.branchConfig.delete({
            where: { branch_code },
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Branch configuration deleted successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting branch config:", error);

        if (error.code === "P2025") {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Branch not found",
                    message: "No configuration found for the specified branch",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

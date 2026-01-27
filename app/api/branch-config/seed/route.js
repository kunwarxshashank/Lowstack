import prisma from "@/libs/prisma";

// Seed initial branch configurations
export async function GET(req) {
    try {
        const branches = [
            { branch_code: "cse", branch_name: "C.S.E", semester_count: 8 },
            { branch_code: "aiml", branch_name: "A.I/M.L", semester_count: 8 },
            { branch_code: "aids", branch_name: "A.I/D.S", semester_count: 8 },
        ];

        const results = [];

        for (const branch of branches) {
            const branchConfig = await prisma.branchConfig.upsert({
                where: { branch_code: branch.branch_code },
                update: {
                    branch_name: branch.branch_name,
                    semester_count: branch.semester_count,
                },
                create: branch,
            });
            results.push(branchConfig);
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: results,
                message: "Branch configurations seeded successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error seeding branch configs:", error);
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

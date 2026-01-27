import prisma from "@/libs/prisma";

// GET - Fetch leaderboard (top users by punya)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 50;

        // Fetch users sorted by punya in descending order
        const topUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                university: true,
                punya: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                punya: "desc",
            },
            take: limit,
        });

        // Add rank to each user
        const leaderboard = topUsers.map((user, index) => ({
            ...user,
            rank: index + 1,
        }));

        return new Response(
            JSON.stringify({
                success: true,
                data: leaderboard,
                total: topUsers.length,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
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

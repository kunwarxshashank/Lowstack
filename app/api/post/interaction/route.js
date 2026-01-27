import prisma from "@/libs/prisma";

// POST - Handle like, dislike, and view interactions
export async function POST(req) {
  try {
    const { postId, action } = await req.json();

    if (!postId || !action) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields",
        message: "postId and action are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let updatedPost;

    switch (action) {
      case "view":
        // Increment views
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { views: { increment: 1 } },
        });
        break;

      case "like":
        // Simply increment likes
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { likes: { increment: 1 } },
        });
        break;

      case "dislike":
        // Simply increment dislikes
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { dislikes: { increment: 1 } },
        });
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid action",
          message: "Action must be 'view', 'like', or 'dislike'"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedPost,
      message: `${action} action completed successfully`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error processing interaction:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

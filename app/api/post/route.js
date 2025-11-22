// app/api/post/route.js - Improved version with consistent response structure

import prisma from "@/libs/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany();
    return new Response(JSON.stringify({
      success: true,
      data: allPosts,
      message: "Posts retrieved successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response(JSON.stringify({
      success: false,
      error: "An error occurred while fetching posts",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req) {
  try {
    const { fileDetails, uploadRes, userEmail } = await req.json();

    // Validate required fields
    if (!fileDetails || !uploadRes || !userEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields",
        message: "fileDetails, uploadRes, and userEmail are required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Find user by email address
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: "User not found",
        message: "No user found with the provided email address"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Check if any files already exist
    const existingFiles = await prisma.post.findMany({
      where: { file_name: { in: uploadRes.map((res) => res.filename) } },
    });

    if (existingFiles.length > 0) {
      const existingFileNames = existingFiles.map((file) => file.file_name);
      return new Response(JSON.stringify({
        success: false,
        error: "Duplicate files detected",
        message: `These files are already uploaded: ${existingFileNames.join(", ")}`,
        duplicateFiles: existingFileNames
      }), {
        status: 409, // Conflict status code
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const createdPosts = [];

    // Validate that fileDetails and uploadRes have the same length
    if (fileDetails.length !== uploadRes.length) {
      return new Response(JSON.stringify({
        success: false,
        error: "Data mismatch",
        message: "Number of file details doesn't match number of uploaded files"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Create posts for each file
    for (let i = 0; i < fileDetails.length; i++) {
      const newPost = await prisma.post.create({
        data: {
          userId: user.id,
          course_name: fileDetails[i].course,
          semester_code: fileDetails[i].semester,
          subject_code: fileDetails[i].subject.link,
          subject_name: fileDetails[i].subject.name,
          title: fileDetails[i].title.trim(),
          description: fileDetails[i].description.trim(),
          category: fileDetails[i].category.trim(),
          file_url: uploadRes[i].url,
          file_name: uploadRes[i].filename,
        },
      });
      createdPosts.push(newPost);
    }

    return new Response(JSON.stringify({
      success: true,
      data: createdPosts,
      message: `Successfully created ${createdPosts.length} post(s)`,
      count: createdPosts.length
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required field",
        message: "Post ID is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Find post first to access file_url for deletion
    const existingPost = await prisma.post.findUnique({
      where: { id: id },
    });
    
    if (!existingPost) {
      return new Response(JSON.stringify({
        success: false,
        error: "Post not found",
        message: "The post you're trying to delete doesn't exist"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Try to delete local uploaded file if the URL points to /uploads/*
    const fileUrl = existingPost.file_url;
    if (fileUrl) {
      try {
        const url = new URL(fileUrl);
        const uploadsIndex = url.pathname.indexOf('/uploads/');
        if (uploadsIndex !== -1) {
          const relativePath = url.pathname.replace(/^\//, ''); // remove leading '/'
          const absolutePath = path.join(process.cwd(), relativePath);
          await unlink(absolutePath);
        }
      } catch (fsErr) {
        // Ignore deletion errors (file may already be gone or remote URL)
        console.warn('File delete warning:', fsErr?.message || fsErr);
      }
    }

    const deletedPost = await prisma.post.delete({
      where: { id: id },
    });
    
    return new Response(JSON.stringify({
      success: true,
      data: deletedPost,
      message: "Post deleted successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error processing the request:", error);

    // Handle case where post doesn't exist
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({
        success: false,
        error: "Post not found",
        message: "The post you're trying to delete doesn't exist"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error", 
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  const [courseName, semester, category, subId] = params.filtered;
  const { searchParams } = new URL(req.url);
  const university = searchParams.get("university");

  try {
    const where = {
      course_name: courseName,
      semester_code: semester,
      category,
      subject_code: subId,
    };
    if (university) where.university = university;

    const filteredPost = await prisma.post.findMany({ where });

    return new Response(JSON.stringify(filteredPost), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500,
    });
  }
}


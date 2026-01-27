import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  const [courseName, semester] = params.filtered;
  const { searchParams } = new URL(req.url);
  const university = searchParams.get("university");

  try {
    const where = {
      course_name: courseName,
      semester_code: semester,
    };
    if (university) where.university = university;

    const filteredSubjects = await prisma.subject.findMany({ where });

    return new Response(JSON.stringify(filteredSubjects), {
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

import prisma from "@/libs/prisma";
//https://next-auth.js.org/configuration/nextjs#getserversession

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const university = searchParams.get("university");

    const where = {};
    if (university) where.university = university;

    const allSubject = await prisma.subject.findMany({ where });
    return new Response(JSON.stringify(allSubject), {
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

export async function POST(req) {
  const { courseName, userSemester, subjectCode, subjectName, userEmail, allowedCategories, university } =
    await req.json();

  try {
    //find user by email address
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    // Check if a subject already exists
    const existingSubject = await prisma.subject.findFirst({
      where: { subject_code: subjectCode },
    });

    // this subject already exists
    if (existingSubject) {
      return new Response("This subject already exists", {
        status: 200,
        statusText: "FAILED",
      });
    }

    // Create the new subject
    const newSubject = await prisma.subject.create({
      data: {
        userId: user.id,
        university: university || "DEFAULT",
        course_name: courseName,
        semester_code: userSemester,
        subject_code: subjectCode.trim().toUpperCase(),
        subject_name: subjectName.trim(),
        allowed_categories: allowedCategories || [],
      },
    });

    return new Response(JSON.stringify(newSubject), {
      status: 201, // Created
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500, // Internal Server Error
    });
  }
}

export async function PUT(req) {
  const { id, courseName, userSemester, subjectCode, subjectName, allowedCategories, university } = await req.json();

  try {
    const updateData = {
      course_name: courseName,
      semester_code: userSemester,
      subject_code: subjectCode.trim().toUpperCase(),
      subject_name: subjectName.trim(),
      allowed_categories: allowedCategories || [],
    };
    if (university) updateData.university = university;

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedSubject), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    return new Response("Failed to update subject", { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await prisma.subject.delete({
      where: { id: id },
    });

    // Process the data and send an appropriate response
    return new Response("Request processed successfully", {
      status: 200,
    });

  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500, // Internal Server Error
    });
  }
}

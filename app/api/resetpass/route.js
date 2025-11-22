import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, email, password } = await request.json();
  console.log(`Received token: ${token}, email: ${email}, password: ${password}`);

  if (!token || !email || !password) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  const trimmedToken = token.trim();
  const trimmedEmail = email.trim();

  const user = await prisma.user.findFirst({
    where: { email: trimmedEmail, resetToken: trimmedToken },
  });

  if (!user) {
    console.log("No user found matching the token and email");
    return NextResponse.json({ success: false, message: "Invalid token or email" }, { status: 400 });
  }

  if (new Date(user.resetTokenExpiry) < new Date()) {
    console.log("Token expired");
    return NextResponse.json({ success: false, message: "Token expired" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: trimmedEmail },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ success: true, message: "Password reset successful" });
};

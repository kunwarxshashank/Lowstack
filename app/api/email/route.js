import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";
import prisma from "@/libs/prisma";
import crypto from "crypto";

export async function POST(request) {
  try {

    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    const { email, subject } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response("User with this email does not exist.", { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600 * 1000);

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/resetpass?token=${token}&email=${email}`;

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry.toISOString(),
      },
    });

    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: "support@lowstack.in", Name: "LowStack" },
            To: [{ Email: email, Name: email.split("@")[0] }],
            Subject: subject,
            TextPart: `Recover Your Password - lowstack.in`,
            HTMLPart: `
              <p>Click here to reset your password:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <br/>
              <small>This link expires in 1 hour.</small>
              <br/>
              Ignore this email if you haven't requested it
            `,
          },
        ],
      });

    return NextResponse.json({ success: true, response: response.body });

  } catch (error) {
    console.error("Mailjet API Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
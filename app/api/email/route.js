import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";
import prisma from "@/libs/prisma";
import crypto from "crypto";

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);



export async function POST(request) {
  try {
    const { email, subject } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response("User with this email does not exist.", { status: 404 });
    }

    // Generate token & expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/resetpass?token=${token}&email=${email}`; // https://lowstack.in/resetpass 
    console.log(`reseturl: ${resetUrl}`)
    // Save token & expiry in user model
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry.toISOString(),
      },
    });

    // Send email via Mailjet
    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: "support@lowstack.in", Name: "LowStack" },
            To: [{ Email: email, Name: email.split("@")[0] }],
            Subject: subject,
            TextPart: `Recover Your Password - lowstack.in`,
            HTMLPart: `<p>Click here to reset your password:<br /><a href="${resetUrl}">${resetUrl}</a></p><small>This link expires in 1 hour.</small><br>Ignore this email if you haven't requested it </br>`,
          },
        ],
      });

    return NextResponse.json({ success: true, response: response.body });
  } catch (error) {
    console.error("Mailjet API Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
};

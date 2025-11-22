import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const { amount, duration, transactionId, email, sem } = await request.json();

    const user = await prisma.user.findFirst({
      where: { email: email }
    });

    if (!user) {
      return new Response("User not found", { status: 404, statusText: "FAILED" });
    }

    const semExpiry = new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000); // Duration in months
    const semExpiryISO = semExpiry.toISOString();

    if (isNaN(semExpiry.getTime())) {
      return new Response("Invalid expiry date", { status: 400 });
    }

    // Build the updated subscription object
    const updatedSubscription = {
      ...user.subscription,  // Existing subscription
      [sem]: true,
      [`${sem}expiry`]: semExpiryISO,
      [`${sem}transactionID`]: transactionId,
      premiumExpiry: semExpiryISO,  // Set overall premium expiry
    };

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { subscription: updatedSubscription },
    });

    return NextResponse.json({
      success: true,
      sem,
      semExpiry: semExpiryISO,
      user: updatedUser.email
    });

  } catch (error) {
    return NextResponse.json({
      message: "Error updating subscription",
      error: error.message
    }, { status: 500 });
  }
};

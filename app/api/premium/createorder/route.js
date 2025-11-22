import Razorpay from "razorpay";

export async function POST(req) {
    try {
        const { amount, currency = "INR" } = await req.json();

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
        };

        const order = await razorpayInstance.orders.create(options);

        return new Response(JSON.stringify(order), { status: 200 });
    } catch (error) {
        console.error("Order creation failed:", error);
        return new Response(JSON.stringify({ error: "Order creation failed" }), { status: 500 });
    }
}

"use client";

import React, { useState, useEffect} from "react";
import { useSession } from "next-auth/react";

const PaymentComponent = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: "sem1", name: "SEMESTER 1 PLAN", price: 999, duration: 6, description: "Including Notes, Pyq, Q/A " },
    { id: "sem2", name: "SEMESTER 2 PLAN", price: 999, duration: 6, description: "Including Notes, Pyq, Q/A " },
    { id: "sem3", name: "SEMESTER 3 PLAN", price: 1299, duration: 6, description: "Including Notes, Pyq, Q/A " },
    { id: "sem4", name: "SEMESTER 4 PLAN", price: 2199, duration: 6, description: "Including Notes, Pyq, Q/A " },
    { id: "sem5", name: "SEMESTER 5 PLAN", price: 2199, duration: 6, description: "Including Notes, Pyq, Q/A " },
    { id: "sem6", name: "SEMESTER 6 PLAN", price: 2999, duration: 6, description: "Including Notes, Pyq, Q/A " }
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handlePayment = async (plan) => {
    setLoading(true);
    try {
      const res = await fetch("/api/premium/createorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price }),
      });
      const order = await res.json();
      console.log(`Order : ${JSON.stringify(order)}`)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LowStack",
        description: plan.description,
        order_id: order.id,
        handler: async function (response) {
          alert("Payment Successful!");

          await fetch("/api/premium", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: plan.price,
              duration: plan.duration,
              transactionId: response.razorpay_payment_id,
              email: session.user.email,
              sem: plan.id,
            }),
            credentials: "include",
          });

          setLoading(false);
          window.location.reload();
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: { color: "#2563EB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  const isPremium =
    session?.user?.subscription?.sem1 ||
    session?.user?.subscription?.sem2 ||
    session?.user?.subscription?.sem3 ||
    session?.user?.subscription?.sem4 ||
    session?.user?.subscription?.sem5 ||
    session?.user?.subscription?.sem6;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-8 px-4">
      {/* Premium card if any sem is active */}
      {isPremium && (
        <div className="w-full max-w-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-xl text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">You are a Premium Member</h1>
              <p className="mt-1 text-indigo-100 text-sm">
                Thanks, {session.user.name}. Enjoy your premium benefits.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-indigo-100">Account</p>
              <p className="text-lg font-semibold">{session.user.name}</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-indigo-100">Premium Expires</p>
              <p className="text-lg font-semibold">
                {session.user.subscription.premiumExpiry
                  ? new Date(session.user.subscription.premiumExpiry).toLocaleString()
                  : "No expiry available"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="bg-white text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:opacity-95">
              Manage Subscription
            </button>
            <button className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:opacity-95">
              Contact Support
            </button>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Subscription Plan</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 max-w-6xl">
        {plans.map(plan => {
          const purchased = session?.user?.subscription?.[plan.id];

          return (
            <div key={plan.id} className={`rounded-lg shadow-lg p-4 ... ${purchased ? 'bg-green-700' : 'bg-[#1d232a] hover:shadow-2xl'}`}>
              <h2 className="text-xl font-semibold text-white mb-2">{plan.name}</h2>
              <p className="text-gray-300 text-sm mb-2">{plan.description}</p>
              <p className={`text-3xl font-bold mb-2 ${purchased ? 'text-white' : 'text-indigo-400'}`}>
                ₹{plan.price}
              </p>
              <p className="text-gray-400 text-sm mb-4">Duration: {plan.duration} Month</p>

              {purchased ? (
                <div className="text-white bg-indigo-600 text-center py-2 rounded cursor-not-allowed">
                  Purchased ✅
                </div>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => handlePayment(plan)}
                  className="w-full bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700 transition"
                >
                  {loading ? "Processing..." : "Subscribe"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentComponent;

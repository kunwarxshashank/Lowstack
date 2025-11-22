"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    console.log(`clicked`)
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/email", {
        email,
        subject: "Password Reset - LowStack.in",
      });

      toast.success("Reset password email sent successfully!");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Something went wrong during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-28 mx-auto md:h-screen lg:py-0">
        <div>
          <a
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-white"
          >
            <Image className="w-8 h-8 mr-2" src={logo} alt="logo" />
            LowStack
          </a>
        </div>

        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-[#1c1c24] border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Forgot Your Password
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handlePasswordReset}>
              <FormField
                label="Your Email"
                type="email"
                name="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />

              <div className="flex gap-1 mr-5 md:mr-0">
                <FormButtons
                  primaryLabel={isLoading ? "Please wait..." : "Reset Your Password"}
                  secondaryLabel="Back"
                  onPrimaryClick={handlePasswordReset}  // This should handle the form submission
                  onSecondaryClick={() => router.back()}  // This should handle going back
                  primaryClassName="btn_loginFormPrimary"
                  secondaryClassName="btn_loginFormSecondary"
                />
              </div>

              <p className="text-sm text-center text-base-800">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-white font-medium hover:underline"
                >
                  Create new user
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

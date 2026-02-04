"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";
import { UserValidation } from "@/libs/validations/user";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Failed to initialize Google login");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate user input using the schema
    const userInput = {
      email,
      password,
    };

    try {
      // Validate the user input
      const validation = UserValidation.UserLogin.safeParse(userInput);

      //if validation is failure, return error message
      if (validation.success === false) {
        const { issues } = validation.error;
        issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        // If validation is successful, make the API request
        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (response.error) {
          toast.error(response.error);
        } else {
          //Redirect to the dashboard on successful login
          toast.success("Successfully Logged in");
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error("NEXT_AUTH Error: " + error);
      toast.error("Something went wrong during login attempt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-100 flex items-center justify-center p-4 relative overflow-hidden bg-[url('/bg-grid.svg')] bg-fixed">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => router.push('/')}
          className="absolute -top-12 left-0 text-base-content/60 hover:text-primary flex items-center gap-2 transition-colors duration-200 text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/5 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 mb-4 shadow-inner ring-1 ring-white/10">
                <Image src={logo} alt="LowStack Logo" width={32} height={32} className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/70">
                Welcome Back
              </h2>
              <p className="text-sm text-base-content/60 mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="btn btn-outline w-full gap-3 hover:bg-base-content/5 border-base-content/10 hover:border-base-content/20 text-base-content transition-all duration-300 relative overflow-hidden group"
            >
              {isGoogleLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <GoogleIcon />
              )}
              <span className="font-semibold">Continue with Google</span>
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-content/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-100/50 backdrop-blur px-2 text-base-content/40">Or continue with</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  classLabel="text-sm font-medium text-base-content/80 ml-1 mb-1.5 block"
                  classInput="input input-bordered w-full bg-base-50/50 focus:bg-base-100 focus:border-primary/50 transition-all duration-300 input-md"
                />
                <div>
                  <FormField
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    classLabel="text-sm font-medium text-base-content/80 ml-1 mb-1.5 block"
                    classInput="input input-bordered w-full bg-base-50/50 focus:bg-base-100 focus:border-primary/50 transition-all duration-300 input-md"
                  />
                  <div className="flex justify-end mt-1.5">
                    <a
                      href="/forgotpass"
                      className="text-xs font-medium text-primary hover:text-primary-focus transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 bg-base-200/30 border-t border-base-content/5 text-center">
            <p className="text-sm text-base-content/60">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-primary hover:text-primary-focus transition-colors hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

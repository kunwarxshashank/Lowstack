"use client";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";
import { UserValidation } from "@/libs/validations/user";

const RegisterPage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate user input using the schema
    const userInput = {
      email,
      name,
      password,
      phoneNumber
    };

    try {
      // Validate the user input
      const validation = UserValidation.registration.safeParse(userInput);

      //if validation is failure, return error message
      if (validation.success === false) {
        const { issues } = validation.error;
        issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        // If validation is successful, make the API request
        const response = await axios.post("/api/user", {
          userRole,
          name,
          email,
          phoneNumber,
          password
        });
        if (response.statusText === "FAILED") {
          toast.error(response.data);
        } else {
        toast.success("Successfully created");
        handleReset();
        router.push("/login");
        }
      }
    } catch (err) {
      console.error("NEXT_AUTH_ERROR: " + err);
      console.log(err.response);
      toast.error("something went wrong !!");
    } finally {
      setIsLoading(false);
    }
  };

const handleReset = () => {
      setPassword("");
      setName("");
      setEmail("");
      setphoneNumber("");
};


  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-28 mx-auto md:h-screen lg:py-0">
        <div>
          <a
            href="/"
            className="flex items-center mb-6  text-2xl font-semibold text-base-content"
          >
            <Image className="w-8 h-8 mr-2" src={logo} alt="logo" />
            LowStack
          </a>
        </div>
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-base-200 border-base-300">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-base-content">
              Sign Up to your account
            </h1>

            <form className="space-y-4 md:space-y-6">
              <FormField
                label="Your Name"
                type="name"
                name="name"
                value={name}
                placeholder="name@example.com"
                onChange={(e) => setName(e.target.value)}
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <FormField
                label="Your email"
                type="email"
                name="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
               <FormField
                label="Your Phone"
                type="phone"
                name="phoneNumber"
                value={phoneNumber || "+91"}
                placeholder="+919876543210"
                onChange={(e) => setphoneNumber(e.target.value)}
                autoComplete="email"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />             
              <FormField
                label="Your Password"
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <div className="flex gap-1 mr-5 md:mr-0">
                <FormButtons
                  primaryLabel={isLoading ? "Please wait..." : "Register"}
                  secondaryLabel="Back"
                  onPrimaryClick={handleSubmit}
                  onSecondaryClick={() => router.back()}
                  primaryClassName="btn_loginFormPrimary"
                  secondaryClassName="btn_loginFormSecondary"
                />
              </div>
              <p className="text-sm text-center text-base-400">
                Already have account?{" "}
                <a
                  href="/login"
                  className="text-base-800 font-medium hover:underline"
                >
                  LOGIN
                </a>
              </p>              
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default RegisterPage;

import { Button } from "@/components/ui/button";
import { RegisterUser } from "@/lib/auth/RegisterUser";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface RegisterFormProps {
    callbackUrl: string;
}

export default function RegisterFormFields({ callbackUrl }:RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/; 

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const image = formData.get("image") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!passwordPattern.test(password)) {
            setErrorMessage("Password must be at least 8 characters and include: 1 uppercase, 1 lowercase and 1 special character.");
            return;
        }
        const res = await RegisterUser({ name, email, password, image });

        if(res.success){
            const signUp = await signIn("credentials", {
                redirect: false, email, password, callbackUrl
            });
            if (signUp?.ok) {
                form.reset();
                window.location.href = "/onboarding";
            } else {
                setErrorMessage("Registered but failed to sign in. Please try signing in manually.");
            }
        } else {
            setErrorMessage("User already exists or sign up failed. Please try again.");
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 text-[#1C2420]">
                <input type="name" name="name" required
                placeholder="Enter your name"
                className="w-full p-3 mb-6 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40"/>
                <input type="text" name="image"
                placeholder="Enter your image url (optional)"
                className="w-full p-3 mb-6 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40"/>
                <input type="email" name="email" required
                placeholder="Enter your email"
                className="w-full p-3 mb-6 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40"/>
                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"} required
                    name="password" placeholder="Enter your password"
                    className="w-full p-3 mb-2 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40" />
                        <span
                        className="absolute text-xl right-3 top-5.5 -translate-y-1/2 cursor-pointer text-[#1C2420]/50"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                </div>
                <Button
                    type="submit"
                    className="bg-[#1F6F5C] text-white hover:bg-[#175446] py-6 rounded-lg font-semibold text-[16px] w-full mt-5"
                >
                    Register
                </Button>
            </form>
        </div>
    )
}
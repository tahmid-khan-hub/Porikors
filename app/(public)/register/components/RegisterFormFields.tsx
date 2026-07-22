import { Button } from "@/components/ui/button";
import { RegisterUser } from "@/lib/auth/RegisterUser";
import getPostAuthRedirect from "@/lib/getPostAuthRedirect";
import { CircleCheckBig, XCircle } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

interface RegisterFormProps {
    callbackUrl: string;
}

export default function RegisterFormFields({ callbackUrl }:RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/; 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const image = formData.get("image") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if(!emailPattern.test(email)) {
            toast.error("Invalid email", {
                description: "Please enter a valid email address.",
                descriptionClassName: "!text-[#C1443D]/80",
                icon: <XCircle className="text-[#C1443D]" size={18} />
            })
            return;
        }

        if (!passwordPattern.test(password)) {
            toast.error("Weak password", {
                description: "Must be at least 8 characters and include 1 uppercase, 1 lowercase and 1 special character.",
                descriptionClassName: "!text-[#C1443D]/80",
                icon: <XCircle className="text-[#C1443D]" size={18} />,
            });
            return;
        }
        const res = await RegisterUser({ name, email, password, image });

        if(res.success){
            const signUp = await signIn("credentials", {
                redirect: false, email, password, callbackUrl
            });
            if (signUp?.ok) {
                const session = await getSession();
                const destination = getPostAuthRedirect(session?.user);
                toast.success("Account created!", {
                    description: "Welcome to Porikors.",
                    descriptionClassName: "!text-[#1F6F5C]/80",
                    icon: <CircleCheckBig className="text-[#1F6F5C]" size={18} /> 
                });

                form.reset();
                setTimeout(() => { window.location.href = destination; }, 1200);
            } else {
                toast.error("Registered but failed to login", {
                    description: "Please try signing in manually.",
                    descriptionClassName: "!text-[#C1443D]/80",
                    icon: <XCircle className="text-[#C1443D]" size={18} />,
                });
            }
        } else {
            toast.error("Registration failed", {
                description: "User already exists or registration failed. Please try again.",
                descriptionClassName: "!text-[#C1443D]/80",
                icon: <XCircle className="text-[#C1443D]" size={18} />,
            });
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 text-[#1C2420]">
                <input type="text" name="name" required
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
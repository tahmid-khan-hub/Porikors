import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { CircleCheckBig, XCircle } from "lucide-react";

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginFormFields({ callbackUrl }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const signin = await signIn("credentials", {
      redirect: false, email, password, callbackUrl,
    });

    if (signin?.ok) {
      toast.success("Welcome back!", {
        description: "You've successfully login.",
        descriptionClassName: "!text-[#1F6F5C]/80",
        icon: <CircleCheckBig className="text-[#1F6F5C]" size={18} /> 
      });
    } else {
      toast.error("Failed to login", {
        description: "Incorrect email or password. Please try again.",
        descriptionClassName: "!text-[#C1443D]/80",
        icon: <XCircle className="text-[#C1443D]" size={18} />,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 text-[#1C2420]">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-6 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            className="w-full p-3 mb-2 bg-white border border-[#DAD7CE] hover:border-[#1F6F5C] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C] focus:border-transparent placeholder:text-[#1C2420]/40"
            required
          />
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
          Login
        </Button>
      </form>
    </div>
  );
}

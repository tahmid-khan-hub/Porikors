import AnimationOnScroll from "@/app/hooks/AnimationOnScroll";
import { GraduationCap, Share2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "1. Create or join a course",
    description: "Teachers create a course in seconds. Students join instantly with a 6-character code.",
  },
  {
    icon: Share2,
    title: "2. Share resources & tasks",
    description: "Upload resources, post announcements, and assign tasks with deadlines.",
  },
  {
    icon: TrendingUp,
    title: "3. Track progress & grades",
    description: "Students track submission status and grades, all from one dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <AnimationOnScroll direction="scale" delay={0.5}><h2 className="text-center text-3xl font-bold tracking-tight text-[#1C2420]">Getting Started is Simple</h2></AnimationOnScroll>

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <AnimationOnScroll key={title} direction="up" delay={i*0.08}><div key={title} className="relative text-center">
            {/* connecting line (desktop only) */}
            {i < steps.length - 1 && (
              <div className="absolute left-1/2 top-6 hidden h-px w-full bg-[#DAD7CE] md:block" />
            )}

            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DAD7CE] bg-white shadow-sm hover:shadow-lg hover:cursor-default transition-transform duration-300 hover:scale-106">
              <Icon className="h-5 w-5 text-[#1F6F5C]" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-[#1C2420]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1C2420]/60">
              {description}
            </p>
          </div></AnimationOnScroll>
        ))}
      </div>
    </section>
  );
}

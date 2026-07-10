import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
      <div className="rounded-3xl bg-[#1F6F5C] px-8 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          GET STARTED TODAY
        </span>

        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Ready to simplify your{" "}
          <span className="text-[#8FCBA8]">classroom?</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
          Create a course, share resources, and track every submission — all
          from one dashboard built for teachers and students.
        </p>

        <Link href="/signup">
            <Button
                size="lg"
                variant="outline"
                className="mt-8 border-white/30 text-black p-6 text-lg"
            >
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
        </Link>
      </div>
    </section>
  );
}
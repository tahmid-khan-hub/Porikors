"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:py-28">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <motion.span initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: "easeOut" }} className="inline-block rounded-full bg-[#1F6F5C]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#1F6F5C] hover:bg-[#1F6F5C]/70 hover:text-white cursor-default">
            NEXT GEN EDUCATION
          </motion.span>

          <motion.h1 initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mt-5 text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[#1C2420] sm:text-5xl">
            Effortless course management for teachers and students
          </motion.h1>

          <motion.p initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: "easeOut" }} className="mt-5 max-w-xl text-sm md:text-base text-[#1C2420]/60 lg:mx-0 mx-auto">
            Empowering educators and learners with tools for collaboration, grading, and resource sharing. Built for focus and academic excellence.
          </motion.p>

          <motion.div initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: "easeOut" }} className="mt-8 flex justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              className="bg-[#1F6F5C] text-white hover:bg-[#175446] px-8 py-6 text-lg"
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex-1"
        >
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[#1F6F5C]/10 blur-3xl" />
          <div className="absolute -bottom-8 -right-4 h-48 w-48 rounded-full bg-[#D98B3F]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-lg border border-[#DAD7CE] shadow-xl">
            <Image
              src="/porikors_banner.png"
              alt="Porikors dashboard preview"
              width={800}
              height={520}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

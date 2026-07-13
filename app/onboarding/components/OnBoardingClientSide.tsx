"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerificationForm from "./VerificationForm";
import RolePicker from "./RolePicker";

export type Role = "teacher" | "student";

export default function OnBoardingClientSide() {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <AnimatePresence>
          {!role ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <RolePicker onSelect={setRole} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* <VerificationForm role={role} onBack={() => setRole(null)} /> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerificationForm from "./VerificationForm";
import RolePicker from "./RolePicker";
import { getStoredRole, setStoredRole } from "@/lib/onboardingStorage";

export type Role = "teacher" | "student";

export default function OnBoardingClientSide() {
  const [role, setRole] = useState<Role | null>(() => getStoredRole());

  function handleSelectRole(role: Role) {
    setStoredRole(role);
    setRole(role);
  }

  function handleBack() {
    setStoredRole(null);
    setRole(null);
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!role ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <RolePicker onSelect={handleSelectRole} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <VerificationForm role={role} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

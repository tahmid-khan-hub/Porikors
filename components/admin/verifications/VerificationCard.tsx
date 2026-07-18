"use client";
import { Button } from "@/components/ui/button";
import { Verification } from "@/types/AdminVerification";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function VerificationCard({ verification,}: { verification: Verification }) {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="rounded-lg border border-[#DAD7CE] bg-white p-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {verification.image ? (
            <Image
              src={verification.image}
              alt=""
              height={16}
              width={16}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 shrink-0 rounded-full bg-[#F6F5F1] border border-[#DAD7CE] flex items-center justify-center text-xs font-medium text-[#1C2420]/60">
              {verification.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-medium text-[#1C2420] truncate">
              {verification.name}
            </p>
            <p className="text-sm text-[#1C2420]/60 truncate">
              {verification.email}
              <span className="mx-1.5 text-[#DAD7CE]">·</span>
              <span className="capitalize">{verification.role}</span>
              <span className="mx-1.5 text-[#DAD7CE]">·</span>
              {verification.institution ?? "No institution given"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button className="inline-flex items-center gap-1.5 rounded-md bg-[#1F6F5C] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#175446] transition-colors">
            <Check className="h-4 w-4" />
            Approve
          </Button>

          <Button
            onClick={() => setShowRejectBox((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#C1443D] px-3 py-1.5 text-sm font-medium text-[#C1443D] bg-white hover:bg-[#C1443D]/15 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showRejectBox && (
          <motion.div
            key="reject-box"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-md border border-[#DAD7CE] bg-[#F6F5F1] p-3">
              <label className="block text-xs font-medium text-[#1C2420]/60 mb-1.5">
                Reason for rejection
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Let the applicant know what needs to be fixed..."
                className="w-full resize-none rounded-md border border-[#DAD7CE] bg-white p-2 text-sm text-[#1C2420] placeholder:text-[#1C2420]/40 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/30"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setShowRejectBox(false);
                    setReason("");
                  }}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-[#1C2420]/60 bg-gray-200 hover:bg-[#1C2420]/15 transition-colors"
                >
                  Cancel
                </Button>
                <Button className="rounded-md bg-[#C1443D] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#C1443D]/90 transition-colors">
                  Confirm Reject
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

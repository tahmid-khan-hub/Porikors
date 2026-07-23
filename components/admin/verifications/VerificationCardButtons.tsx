"use client";
import { Button } from "@/components/ui/button";
import { approveVerification, rejectVerification, } from "@/lib/api/verificationActions";
import { Verification } from "@/types/AdminVerification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function VerificationCardButtons({ verification, }: { verification: Verification; }) {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const removeFromCache = () => {
    queryClient.setQueriesData<{ pages: { items: Verification[]; nextCursor: string | null }[]; }>({ queryKey: ["verifications"] }, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page, items: page.items.filter((item) => item.id !== verification.id),
        })),
      };
    });
  };

  const approveMutation = useMutation({
    mutationFn: () => approveVerification(verification.id),
    onSuccess: () => {
      removeFromCache();
      toast.success(`${verification.name} approved`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const rejectMutation = useMutation({
    mutationFn: () => rejectVerification(verification.id, reason),
    onSuccess: () => {
      removeFromCache();
      toast.success(`${verification.name} rejected`);
      setShowRejectBox(false);
      setReason("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isBusy = approveMutation.isPending || rejectMutation.isPending;
  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          disabled={isBusy}
          onClick={() => approveMutation.mutate()}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#1F6F5C] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#175446] transition-colors disabled:opacity-50"
        >
          {approveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Approve
        </Button>

        <Button
          disabled={isBusy}
          onClick={() => setShowRejectBox((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#C1443D] px-3 py-1.5 text-sm font-medium text-[#C1443D] bg-white hover:bg-[#C1443D]/15 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showRejectBox && (
          <motion.div
            key="reject-box"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden w-full"
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
                <Button
                  disabled={
                    reason.trim().length === 0 || rejectMutation.isPending
                  }
                  onClick={() => rejectMutation.mutate()}
                  className="rounded-md bg-[#C1443D] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#C1443D]/90 transition-colors disabled:opacity-50"
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

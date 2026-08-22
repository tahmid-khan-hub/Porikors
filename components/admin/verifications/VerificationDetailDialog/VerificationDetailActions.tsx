"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";

interface VerificationDetailActionsProps {
    showRejectBox: boolean;
    reason: string;
    setReason: (value: string) => void;
    isApproving: boolean;
    isRejecting: boolean;
    isBusy: boolean;
    onOpenRejectBox: () => void;
    onCancelReject: () => void;
    onConfirmReject: () => void;
    onApprove: () => void;
}

export default function VerificationDetailActions({
  showRejectBox, reason, setReason, isApproving, isRejecting, isBusy,
  onOpenRejectBox, onCancelReject, onConfirmReject, onApprove,
}: VerificationDetailActionsProps) {
    return (
        <>
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
                        <div className="rounded-md border border-[#DAD7CE] bg-[#F6F5F1] p-3">
                            <label className="block text-xs font-medium text-[#1C2420]/60 mb-1.5">Reason for rejection</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                placeholder="Let the applicant know what needs to be fixed..."
                                className="w-full resize-none rounded-md border border-[#DAD7CE] bg-white p-2 text-sm text-[#1C2420] placeholder:text-[#1C2420]/40 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/30"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <DialogFooter className="gap-2 sm:gap-2">
                {showRejectBox ? (
                    <>
                        <Button variant="outline" onClick={onCancelReject} disabled={isBusy}>Cancel</Button>
                        <Button
                            disabled={reason.trim().length === 0 || isRejecting}
                            onClick={onConfirmReject}
                            className="bg-[#C1443D] hover:bg-[#C1443D]/90 text-white"
                        >
                            {isRejecting ? "Rejecting..." : "Confirm Reject"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            disabled={isBusy}
                            variant="outline"
                            onClick={onOpenRejectBox}
                            className="border-[#C1443D] text-[#C1443D] hover:bg-[#C1443D]/10"
                        >
                            <X className="h-4 w-4 mr-1.5" /> Reject
                        </Button>
                        <Button
                            disabled={isBusy}
                            onClick={onApprove}
                            className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                        >
                            {isApproving ? (<Loader2 className="h-4 w-4 animate-spin mr-1.5" />) : (<Check className="h-4 w-4 mr-1.5" />)}
                            Approve
                        </Button>
                    </>
                )}
            </DialogFooter>
        </>
    );
}
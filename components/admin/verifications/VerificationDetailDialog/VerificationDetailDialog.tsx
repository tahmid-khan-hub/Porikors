"use client"
import { approveVerification, rejectVerification } from "@/lib/api/verificationActions";
import { Verification } from "@/types/AdminVerification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VerificationDetailActions from "./VerificationDetailActions";
import VerificationDetailContent from "./VerificationDetailContent";

interface VerificationDetailDialogProps {
  verification: Verification;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VerificationDetailDialog({ verification, open, onOpenChange }: VerificationDetailDialogProps) {
    const [showRejectBox, setShowRejectBox] = useState(false);
    const [reason, setReason] = useState("");
    const queryClient = useQueryClient();

    const removeFromCache = () => {
        queryClient.setQueriesData<{ pages: { items: Verification[]; nextCursor: string | null }[] }>(
            { queryKey: ["verifications"] },
            (old) => {
                if (!old) return old;
                return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.id !== verification.id),
                    })),
                };
            }
        );
    };

    const approveMutation = useMutation({
        mutationFn: () => approveVerification(verification.id),
        onSuccess: () => {
            removeFromCache();
            toast.success(`${verification.name} approved`);
            onOpenChange(false);
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
            onOpenChange(false);
        },
        onError: (err: Error) => toast.error(err.message),
    });

    const isBusy = approveMutation.isPending || rejectMutation.isPending;
    function handleOpenChange(next: boolean) {
        if (isBusy) return;
        if (!next) {
            setShowRejectBox(false);
            setReason("");
        }
        onOpenChange(next);
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="capitalize">
                        {verification.requested_role} verification — {verification.name}
                    </DialogTitle>
                </DialogHeader>

                <VerificationDetailContent verification={verification} />

                <VerificationDetailActions
                    showRejectBox={showRejectBox}
                    reason={reason}
                    setReason={setReason}
                    isApproving={approveMutation.isPending}
                    isRejecting={rejectMutation.isPending}
                    isBusy={isBusy}
                    onOpenRejectBox={() => setShowRejectBox(true)}
                    onCancelReject={() => { setShowRejectBox(false); setReason(""); }}
                    onConfirmReject={() => rejectMutation.mutate()}
                    onApprove={() => approveMutation.mutate()}
                />
            </DialogContent>
        </Dialog>
    )
}
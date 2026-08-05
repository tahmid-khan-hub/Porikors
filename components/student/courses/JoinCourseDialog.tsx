"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinCourse } from "@/lib/actions/joinCourse";
import { KeyRound } from "lucide-react";

export default function JoinCourseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [code, setCode] = useState("");
    const queryClient = useQueryClient();
    const router = useRouter();

    const joinMutation = useMutation({
        mutationFn: (code: string) => joinCourse(code),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(`Joined "${result.data.title}"`);
                queryClient.invalidateQueries({ queryKey: ["student", "courses"] });
                queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
                setCode("");
                onOpenChange(false);
                router.push(`/student/courses/${result.data.id}`);
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to join course"),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Enter a join code");
            return;
        }
        joinMutation.mutate(code.trim());
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setCode(""); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <div className="w-10 h-10 rounded-lg bg-[#1F6F5C]/10 flex items-center justify-center mb-1">
                        <KeyRound size={18} className="text-[#1F6F5C]" />
                    </div>
                    <DialogTitle>Join a course</DialogTitle>
                    <DialogDescription>
                        Ask your teacher for the 6-character course code.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. 7K9PXR"
                        maxLength={6}
                        autoFocus
                        className="text-center text-lg tracking-[0.3em] font-mono uppercase"
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={joinMutation.isPending}
                            className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                        >
                            {joinMutation.isPending ? "Joining..." : "Join course"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
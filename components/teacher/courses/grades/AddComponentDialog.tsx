"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AssessmentComponent, AssessmentComponentInput } from "@/types/grade";

interface AddComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComponent: AssessmentComponent | null;
  onSubmit: (values: AssessmentComponentInput) => void;
  isSubmitting: boolean;
}

export default function AddComponentDialog({ open, onOpenChange, initialComponent, onSubmit, isSubmitting, }: AddComponentDialogProps) {
  const [name, setName] = useState(initialComponent?.name ?? "");
  const [maxMarks, setMaxMarks] = useState<string>(
    initialComponent ? String(initialComponent.max_marks) : "100"
  );

  function handleSubmit() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    const parsed = Number(maxMarks);
    if (!parsed || parsed <= 0) { toast.error("Max marks must be greater than 0"); return; }

    onSubmit({ name: name.trim(), maxMarks: parsed });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>{initialComponent ? "Edit Column" : "New Grade Column"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Midterm Exam" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">Max Marks</label>
                    <Input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    placeholder="100"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                >
                    {isSubmitting ? "Saving..." : initialComponent ? "Save Changes" : "Add Column"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
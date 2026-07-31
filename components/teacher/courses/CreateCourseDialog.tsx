"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CreateCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: { title: string; description?: string }) => void;
    isPending: boolean;
}

export default function CreateCourseDialog({open, onOpenChange, onSubmit, isPending }: CreateCourseDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim() || undefined });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create course</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <Input
                        placeholder="Course title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending || !title.trim()}>
                        {isPending ? "Creating..." : "Create course"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
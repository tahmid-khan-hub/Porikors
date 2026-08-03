"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function ResourceCardMenu ({ onEdit, onDelete, }: {
  onEdit: () => void; onDelete: () => void; }) {
    const [alertOpen, setAlertOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button
                        className="rounded-md p-1.5 text-[#6B7369] hover:bg-[#F6F5F1] hover:text-[#1C2420] transition-colors"
                        aria-label="Resource options"
                        >
                            <MoreVertical size={16} />
                        </button>
                    }
                />
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit} className="gap-2">
                        <Pencil size={14} />Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setAlertOpen(true)}
                        className="gap-2 text-[#C1443D] focus:text-[#C1443D]"
                    >
                        <Trash2 size={14} />Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this resource?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Students will no longer be able to access it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDelete}
                            className="bg-[#C1443D] hover:bg-[#a8382f] text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
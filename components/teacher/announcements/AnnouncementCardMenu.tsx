"use client"
import { deleteAnnouncement } from "@/lib/actions/createDeleteAndUpdateAnnouncements";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface AnnouncementCardMenuProps {
    announcementId: string;
    queryKey: unknown[];
    onEdit: () => void;
}

export default function AnnouncementCardMenu ({announcementId, queryKey, onEdit} :AnnouncementCardMenuProps) {
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: () => deleteAnnouncement(announcementId),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Announcement deleted");
                queryClient.invalidateQueries({ queryKey });
            } else toast.error(result.error);
            
            setDialogOpen(false);
        },
        onError: () => { toast.error("Failed to delete announcement"); setDialogOpen(false); },
    })

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-md p-1 hover:bg-black/5">
                    <MoreVertical size={16} className="text-[#6B7369]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil size={14} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDialogOpen(true)} className={"text-[#C1443D] focus:text-[#C1443D]"}>
                        <Trash2 size={14} className="mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete announcement?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This can&apos;t be undone. Students will no longer see this announcement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                            className="bg-[#C1443D] hover:bg-[#A73731]"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
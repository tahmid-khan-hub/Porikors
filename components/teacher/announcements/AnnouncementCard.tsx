"use client"
import { updateAnnouncement } from "@/lib/actions/createDeleteAndUpdateAnnouncements";
import { Announcement } from "@/types/announcement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AnnouncementCardMenu from "./AnnouncementCardMenu";

export default function AnnouncementCard({ announcement, queryKey, }: {
    announcement: Announcement; queryKey: unknown[]; }) {
        const queryClient = useQueryClient();
        const [isEditing, setIsEditing] = useState(false)
        const [draft, setDraft] = useState("");

        const updateMutation = useMutation({
            mutationFn: (content: string) => updateAnnouncement(announcement.id, content),
            onSuccess: (result) => {
                if (result.success) {
                    toast.success("Announcement updated");
                    setIsEditing(false);
                    queryClient.invalidateQueries({ queryKey });
                } else toast.error(result.error);
            },
            onError: () => toast.error("Failed to update announcement"),
        })

    return (
        <div className="relative rounded-lg border border-[#DAD7CE] bg-white p-4">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-md border border-[#DAD7CE] p-2 text-sm text-[#1C2420] outline-none"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setDraft(announcement.content);
                            }}
                            className="rounded-md px-3 py-1.5 text-sm text-[#6B7369]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => updateMutation.mutate(draft)}
                            disabled={updateMutation.isPending || !draft.trim()}
                            className="rounded-md bg-[#1F6F5C] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 whitespace-pre-wrap wrap-break-word text-sm text-[#1C2420]">{announcement.content}</p>
                        <AnnouncementCardMenu
                            announcementId={announcement.id}
                            queryKey={queryKey}
                            onEdit={() => {
                                setDraft(announcement.content); setIsEditing(true);
                            }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-[#6B7369]">
                        {new Date(announcement.createdAt).toLocaleString()}
                        {announcement.updatedAt !== announcement.createdAt && " (edited)"}
                    </p>
                </>
            )}
        </div>  
    )
}
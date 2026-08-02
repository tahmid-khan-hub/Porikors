"use client";
import { createGlobalAnnouncement } from "@/lib/actions/createDeleteAndUpdateAnnouncements";
import { fetchGlobalAnnouncements } from "@/lib/api/fetchAnnouncements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AnnouncementCard from "./AnnouncementCard";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalAnnouncementsGrid () {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState("");
    const queryKey = ["announcements", "global"];

    const { data: announcements, isLoading } = useQuery({
        queryKey,
        queryFn: fetchGlobalAnnouncements,
    });

    const createMutation = useMutation({
        mutationFn: (content: string) => createGlobalAnnouncement(content),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Announcement posted to all your courses");
                setDraft("");
                queryClient.invalidateQueries({ queryKey });
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to post announcement"),
    });

    const handlePost = () => {
        if (!draft.trim()) return;
        createMutation.mutate(draft);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-[#DAD7CE] bg-[#F6F5F1] p-4">
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write an announcement for all your students..."
                    rows={3}
                    className="w-full resize-none rounded-md border bg-white border-[#DAD7CE] text-[#1C2420] p-3 text-sm outline-none"
                />
                <div className="mt-2 flex justify-end">
                    <Button
                        onClick={handlePost}
                        disabled={createMutation.isPending || !draft.trim()}
                        className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#1F6F5C] disabled:opacity-50"
                    >
                        {createMutation.isPending ? "Posting..." : "Post to all courses"}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="h-46 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
            ) : announcements && announcements.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {announcements.map((a) => (
                        <AnnouncementCard key={a.id} announcement={a} queryKey={queryKey} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <Megaphone size={22} className="text-[#6B7369]" />
                    </div>
                    <p className="text-sm text-[#6B7369]">No announcements yet for all course.</p>
                </div>
            )}
        </div>
    )
}
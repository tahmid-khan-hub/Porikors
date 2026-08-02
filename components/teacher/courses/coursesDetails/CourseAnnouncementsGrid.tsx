"use client"
import { createCourseAnnouncement } from "@/lib/actions/createDeleteAndUpdateAnnouncements";
import { fetchCourseAnnouncements } from "@/lib/api/fetchAnnouncements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function CourseAnnouncementsGrid ({ courseId }: { courseId: string }) {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState("");

    const { data: announcements, isLoading } = useQuery({
        queryKey: ["announcements", "course", courseId],
        queryFn: () => fetchCourseAnnouncements(courseId),
    })
    const createMutation = useMutation({
        mutationFn: (content: string) => createCourseAnnouncement(courseId, content),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Announcement posted");
                setDraft("");
                queryClient.invalidateQueries({ queryKey: ["announcements", "course", courseId] });
            } else  toast.error(result.error);
        },
        onError: () => toast.error("Failed to post announcement"),
    });

    const handlePost = () => {
        if (!draft.trim()) return;
        createMutation.mutate(draft);
    };
    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-lg border p-4" style={{ borderColor: "#DAD7CE", backgroundColor: "#F6F5F1" }}>
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write an announcement for this course..."
                    rows={3}
                    className="w-full resize-none rounded-md border bg-white p-3 text-sm outline-none"
                    style={{ borderColor: "#DAD7CE", color: "#1C2420" }}
                />
                <div className="mt-2 flex justify-end">
                    <button
                        onClick={handlePost}
                        disabled={createMutation.isPending || !draft.trim()}
                        className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: "#1F6F5C" }}
                    >
                        {createMutation.isPending ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p style={{ color: "#6B7369" }}>Loading announcements...</p>
            ) : announcements && announcements.length > 0 ? (
                <div></div>
            ) : (
                <p>No announcements yet for this course.</p>
            )}
        </div>
    )
}
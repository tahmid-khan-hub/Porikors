"use client"
import { motion } from "framer-motion";
import { createCourseAnnouncement } from "@/lib/actions/createDeleteAndUpdateAnnouncements";
import { fetchCourseAnnouncements } from "@/lib/api/fetchAnnouncements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AnnouncementCard from "../../announcements/AnnouncementCard";
import { Megaphone } from "lucide-react";

export default function CourseAnnouncementsGrid ({ courseId }: { courseId: string }) {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState("");
    const queryKey = ["announcements", "course", courseId]

    const { data: announcements, isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchCourseAnnouncements(courseId),
    })
    const createMutation = useMutation({
        mutationFn: (content: string) => createCourseAnnouncement(courseId, content),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Announcement posted");
                setDraft("");
                queryClient.invalidateQueries({ queryKey });
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
            <div className="rounded-lg border p-3" style={{ borderColor: "#DAD7CE", backgroundColor: "#F6F5F1" }}>
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
                <div className="h-46 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
            ) : announcements && announcements.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {announcements.map((a, index) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 + index * 0.06 }}
                            whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut", delay: 0 } }}
                        >
                            <AnnouncementCard announcement={a} queryKey={queryKey} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <Megaphone size={22} className="text-[#6B7369]" />
                    </div>
                    <p className="text-sm text-[#6B7369]">No announcements yet for this course.</p>
                </div>
            )}
        </div>
    )
}
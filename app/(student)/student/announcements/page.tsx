import AnnouncementsFeed from "@/components/student/announcements/AnnouncementsFeed";

export default function StudentAnnouncementsPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold mt-5 text-[#1C2420]">Announcements</h1>
            <AnnouncementsFeed limit={20} />
        </div>
    );
}
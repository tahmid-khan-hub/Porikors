import GlobalAnnouncementsGrid from "@/components/teacher/announcements/GlobalAnnouncementsGrid";

export default function TeacherGlobalAnnouncementsPage() {
    return (
        <div className="mt-3">
            <h1 className="text-2xl font-semibold text-[#1C2420] mb-1">Announcements</h1>
            <p className="text-sm text-[#6B7369] mb-6">
                Posted here, these go out to every student across all your courses.
            </p>
            <GlobalAnnouncementsGrid />
        </div>
    );
}
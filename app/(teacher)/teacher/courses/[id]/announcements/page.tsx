import CourseAnnouncementsGrid from "@/components/teacher/courses/coursesDetails/CourseAnnouncementsGrid";

export default async function CourseAnnouncementsPage({ params, }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    return (
        <div className="p-6">
            <CourseAnnouncementsGrid courseId={id} />
        </div>
    );
}
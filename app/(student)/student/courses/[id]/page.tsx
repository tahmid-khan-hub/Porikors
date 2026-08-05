import StudentCourseHeader from "@/components/student/courses/detail/StudentCourseHeader";
import StudentCourseTabs from "@/components/student/courses/detail/StudentCourseTabs";

export default async function StudentCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = await params;

    return (
        <div className="flex flex-col gap-6">
            <StudentCourseHeader courseId={courseId} />
            <StudentCourseTabs courseId={courseId} />
        </div>
    );
}
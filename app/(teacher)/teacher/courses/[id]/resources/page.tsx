import CourseResourcesGrid from "@/components/teacher/courses/coursesDetails/CourseResourcesGrid";

export default async function CourseResourcesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div>
            <CourseResourcesGrid courseId={id} />
        </div>
    )
}
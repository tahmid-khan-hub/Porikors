import StudentTaskDetailView from "@/components/student/tasks/StudentTaskDetailView";

export default async function StudentTaskPage({ params, }: {
  params: Promise<{ id: string; taskId: string }>;
}) {
    const { id: courseId, taskId } = await params;
    return <StudentTaskDetailView courseId={courseId} taskId={taskId} />;
}
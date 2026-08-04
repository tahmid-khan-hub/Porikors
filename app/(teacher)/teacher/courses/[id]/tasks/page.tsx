import TaskGrid from "@/components/teacher/courses/tasks/TaskGrid";

export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;

  return <TaskGrid courseId={courseId} />;
}
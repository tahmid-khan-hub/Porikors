import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import TaskSubmissionsView from "@/components/teacher/courses/tasks/submissions/TaskSubmissionsView";

export default async function TaskSubmissionsPage({ params, }: {
    params: Promise<{ id: string; taskId: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "teacher") redirect("/login");

    const { id: courseId, taskId } = await params;
    return <TaskSubmissionsView courseId={courseId} taskId={taskId} />;
}
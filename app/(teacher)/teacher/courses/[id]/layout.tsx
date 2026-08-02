import CourseDetailChrome from "@/components/teacher/courses/coursesDetails/CourseDetailChrome";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CourseDetailLayout({ children, params, }: {
    children: React.ReactNode; params: Promise<{ id: string }>; }) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) redirect("/login");
    
    if(session.user.role !== "teacher" || session.user.roleStatus !== "approved") redirect("/404");

    const { id } = await params;

    return <CourseDetailChrome courseId={id}>{children}</CourseDetailChrome>;
}
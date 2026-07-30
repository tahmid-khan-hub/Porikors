import TeacherChrome from "@/components/teacher/TeacherChrome";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) redirect("/login");

    if(session.user.role !== "teacher" || session.user.roleStatus !== "approved") redirect("/404");
    
    return <TeacherChrome user={session.user}>{children}</TeacherChrome>;
}
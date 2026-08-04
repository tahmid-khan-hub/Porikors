import StudentChrome from "@/components/student/StudentChrome";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) redirect("/login");

    if(session.user.role !== "student" || session.user.roleStatus !== "approved") redirect("/404");
    
    return <StudentChrome user={session.user}>{children}</StudentChrome>;
}
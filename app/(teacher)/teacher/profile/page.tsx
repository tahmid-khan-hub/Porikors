import TeacherProfileContent from "@/components/teacher/profile/TeacherProfileContent";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TeacherProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "teacher") redirect("/login");

    return (
        <div className="py-6">
            <TeacherProfileContent />
        </div>
    );
}
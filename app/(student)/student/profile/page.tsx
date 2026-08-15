import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import StudentProfileContent from "@/components/student/profile/StudentProfileContent";

export default async function StudentProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "student") redirect("/login");

    return (
        <div className="py-6">
            <StudentProfileContent />
        </div>
    );
}
import CourseGrid from "@/components/teacher/courses/CourseGrid";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function TeacherCoursesPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-medium text-[#1C2420]">Courses</h1>
            </div>
            <CourseGrid teacherId={session!.user.id} />
        </div>
    );
}
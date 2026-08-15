import Link from "next/link";
import { StudentCourseSummary } from "@/types/profile";
import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentCourseList({ courses }: { courses: StudentCourseSummary[] }) {
    const activeCount = courses.filter((c) => !c.isArchived).length;

    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white p-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-[#1C2420]">My Courses</h3>
                    <span className="text-xs text-[#6B7369] bg-[#F6F5F1] rounded-full px-2 py-0.5">
                        {activeCount} Active
                    </span>
                </div>
                <Link href="/student/courses" className="text-sm font-medium text-[#1F6F5C] hover:text-[#175446]">
                    View Catalog
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <div className="h-11 w-11 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <BookOpen size={18} className="text-[#6B7369]" />
                    </div>
                    <p className="text-sm text-[#6B7369]">You haven&apos;t joined any courses yet. Explore the course catalog to begin.</p>
                    <Link href="/student/courses">
                        <Button variant="outline" size="sm">Join a course</Button>
                    </Link>
                </div>
            ) : (
                <div>
                    {courses.map((course) => (
                        <Link
                            key={course.courseId}
                            href={`/student/courses/${course.courseId}`}
                            className="relative flex items-center justify-between py-3 border-b border-[#DAD7CE] last:border-0 hover:bg-[#F6F5F1]/60 -mx-2 px-2 rounded-md"
                        >
                            <div className="relative z-10">
                                <div className="text-sm font-medium text-[#1C2420]">{course.courseName}</div>
                                <div className="text-xs text-[#6B7369]">{course.teacherName}</div>
                            </div>
                            <div className="relative z-10 flex items-center gap-2">
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: course.isArchived ? "#8A9186" : "#3B8F5C" }}
                                />
                                    <ChevronRight size={16} className="text-[#8A9186]" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
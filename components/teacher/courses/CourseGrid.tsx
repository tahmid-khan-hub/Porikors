"use client"
import { createCourse } from "@/lib/actions/createCourse";
import { fetchTeacherCourses } from "@/lib/api/fetchCourses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Plus } from "lucide-react";
import CreateCourseDialog from "./CreateCourseDialog";
import CourseCard from "./CourseCard";

export default function CourseGrid({ teacherId }: { teacherId: string }) {
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data: courses, isLoading } = useQuery({
        queryKey: ["courses", teacherId],
        queryFn: fetchTeacherCourses,
    })

    const createMutation = useMutation({
        mutationFn: ({title, description} : {title: string; description?: string}) =>
            createCourse(teacherId, title, description),
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ["courses", teacherId] });
                toast.success(`Course created — join code ${result.course.join_code}`);
                setDialogOpen(false);
            } else {
                toast.error(result.error);
            }
        },
        onError: () => toast.error("Something went wrong creating the course"),
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white border border-[#DAD7CE] rounded-xl h-33 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!isLoading && (!courses || courses.length === 0)) {
        return (
            <>
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-dashed border-[#DAD7CE] rounded-xl py-16 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <BookOpen size={22} className="text-[#6B7369]" />
                    </div>
                    <div>
                        <p className="font-medium text-[15px] text-[#1C2420]">No courses yet</p>
                        <p className="text-sm text-[#6B7369] mt-1">Create your first course to get started.</p>
                    </div>
                    <button
                        onClick={() => setDialogOpen(true)}
                        className="mt-2 bg-[#1F6F5C] text-[#F6F5F1] rounded-lg px-4 h-9 text-sm font-medium flex items-center gap-1.5 hover:bg-[#175446] transition-colors"
                    >
                        <Plus size={16} />
                        Create course
                    </button>
                </div>

                <CreateCourseDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={(values) => createMutation.mutate(values)}
                    isPending={createMutation.isPending}
                />
            </>
        );
    }
    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {courses?.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
                <button
                    onClick={() => setDialogOpen(true)}
                    className="border border-dashed border-[#DAD7CE] rounded-xl flex flex-col items-center justify-center gap-2 text-[#6B7369] min-h-33 hover:border-[#1F6F5C] hover:text-[#1F6F5C] transition-colors"
                >
                    <Plus size={22} />
                    <span className="text-sm">Create course</span>
                </button>
            </div>

            <CreateCourseDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={(values) => createMutation.mutate(values)}
                isPending={createMutation.isPending}
            />
        </>
    )
}
"use client"
import { createCourse } from "@/lib/actions/createCourse";
import { fetchTeacherCourses } from "@/lib/api/fetchCourses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CourseCard from "./CourseCard";
import { Plus } from "lucide-react";
import CreateCourseDialog from "./CreateCourseDialog";

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
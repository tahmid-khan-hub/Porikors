"use client"
import { Course } from "@/types/course"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel,
 AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Archive, ArchiveRestore, MoreVertical, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveCourse, deleteCourse } from "@/lib/actions/archiveAndDeleteCourse";
import { toast } from "sonner";
import { useState } from "react";

interface CourseCardMenuProps {
    course: Course;
    teacherId: string;
}

export default function CourseCardMenu({ course, teacherId }:CourseCardMenuProps) {
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const archiveMutation = useMutation({
        mutationFn: () => archiveCourse(course.id, teacherId, !course.isArchived),
        onSuccess: (result) => {
            if(result.success) {
                queryClient.invalidateQueries({ queryKey: ["courses", teacherId] })
                toast.success(course.isArchived ? "Course restored" : "Course archived");
            } else  toast.error(result.error);
        },
        onError: () => toast.error("Something went wrong"),
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteCourse(course.id, teacherId),
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ["courses", teacherId] });
                toast.success("Course deleted");
            } else toast.error(result.error);
            
            setDeleteDialogOpen(false);
        },
        onError: () => { toast.error("Something went wrong"); setDeleteDialogOpen(false); },
    })
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button aria-label="Course options" className="text-[#6B7369]"><MoreVertical size={18} /></button>
                    }
                    onClick={(e) => e.preventDefault()}
                />
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            archiveMutation.mutate();
                        }}
                    >
                        {course.isArchived ? (
                            <> <ArchiveRestore size={16} className="mr-2" /> Restore </>
                        ) : (
                            <> <Archive size={16} className="mr-2" /> Archive </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            setDeleteDialogOpen(true);
                        }}
                        className="text-[#C1443D] focus:text-[#C1443D]"
                    >
                        <Trash2 size={16} className="mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this course?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently deletes &quot;{course.title}&quot; and all its enrollments, resources, tasks and grades. This can not be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteMutation.mutate()}
                            className="bg-[#C1443D] hover:bg-[#a3382f]"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
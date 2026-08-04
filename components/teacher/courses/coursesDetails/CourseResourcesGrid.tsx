"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createResource, deleteResource, updateResource } from "@/lib/actions/createDeleteAndUpdateResources";
import { fetchCourseResources } from "@/lib/api/fetchResources";
import { Resource, ResourceFormValues } from "@/types/resources";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResourceCard from "../../resources/ResourceCard";
import ResourceFormDialog from "../../resources/ResourceFormDialog";

export default function CourseResourcesGrid({ courseId }: { courseId: string }) {
    const queryClient = useQueryClient();
    const [formOpen, setFormOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const queryKey = ["resources", "course", courseId];

    const { data: resources, isLoading } = useQuery({
        queryKey, queryFn: () => fetchCourseResources(courseId),
    });

    const createMutation = useMutation({
        mutationFn: (values: ResourceFormValues) => createResource({ course_id: courseId, ...values }),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource added");
                queryClient.invalidateQueries({ queryKey });
                setFormOpen(false);
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to add resource"),
    });

    const updateMutation = useMutation({
        mutationFn: (values: ResourceFormValues & { id: string }) => updateResource({ course_id: courseId, ...values }),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource updated");
                queryClient.invalidateQueries({ queryKey });
                setFormOpen(false);
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to update resource"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteResource(id, courseId),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource deleted");
                queryClient.invalidateQueries({ queryKey });
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to delete resource"),
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1C2420]">Resources</h2>
                <Button
                    onClick={() => { setEditingResource(null); setFormOpen(true); }}
                    className="bg-[#1F6F5C] hover:bg-[#175446] text-white gap-2"
                >
                    <Plus size={16} /> Add Resource
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : resources && resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 + index * 0.06 }}
                            whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut", delay: 0 } }}
                        >
                            <ResourceCard
                                resource={resource}
                                onEdit={() => { setEditingResource(resource); setFormOpen(true); }}
                                onDelete={() => deleteMutation.mutate(resource.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <FileText size={22} className="text-[#6B7369]" />
                    </div>
                    <p className="text-sm text-[#6B7369]">No resources yet for this course.</p>
                </div>
            )}

            <ResourceFormDialog
                key={editingResource?.id ?? "new"}
                open={formOpen}
                onOpenChange={setFormOpen}
                initialResource={editingResource}
                onSubmit={(values) => {
                    if (editingResource) {
                        updateMutation.mutate({ id: editingResource.id, ...values });
                    } else createMutation.mutate(values);
                }}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    )
}
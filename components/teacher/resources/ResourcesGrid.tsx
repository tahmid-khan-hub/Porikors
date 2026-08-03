"use client"
import { Button } from "@/components/ui/button";
import { createResource, deleteResource, updateResource } from "@/lib/actions/createDeleteAndUpdateResources";
import { fetchResources } from "@/lib/api/fetchResources";
import { Resource, ResourceFormValues } from "@/types/resources";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResourceCard from "./ResourceCard";
import ResourceFormDialog from "./ResourceFormDialog";
import { ResourcesEmptyState, ResourcesSkeleton } from "./ResourceEmptyStateAndSkeleton";

export default function ResourcesGrid({ courseId }: { courseId?: string | null }) {
    const queryClient = useQueryClient();
    const [formOpen, setFormOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const { data: resources, isLoading } = useQuery({
        queryKey: ["resources", courseId ?? "global"],
        queryFn: () => fetchResources(courseId),
    })

    const createMutation = useMutation({
        mutationFn: (values: ResourceFormValues) => createResource({course_id: courseId ?? null, ...values}),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource added");
                queryClient.invalidateQueries({ queryKey: ["resources"] });
                setFormOpen(false);
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to add resource"),
    })
    const updateMutation = useMutation({
        mutationFn: (values: ResourceFormValues & { id: string }) => updateResource({ course_id: courseId ?? null, ...values }),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource updated");
                queryClient.invalidateQueries({ queryKey: ["resources"] });
                setFormOpen(false);
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to update resource"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteResource(id, courseId ?? null),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resource deleted");
                queryClient.invalidateQueries({ queryKey: ["resources"] });
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to delete resource"),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1C2420]">Resources</h2>
                <Button
                onClick={() => { setEditingResource(null); setFormOpen(true); }}
                className="bg-[#1F6F5C] hover:bg-[#175446] text-white gap-2"
                >
                    <Plus size={16} /> Add Resource
                </Button>
            </div>

            {isLoading ? <ResourcesSkeleton /> : 
            resources && resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onEdit={() => {
                                setEditingResource(resource);
                                setFormOpen(true);
                            }}
                            onDelete={() => deleteMutation.mutate(resource.id)}
                        />
                    ))}
                </div>
            ) : <ResourcesEmptyState /> 
            }

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
"use client";
import { fetchCourseTasks } from "@/lib/api/fetchTasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import TaskFormDialog from "./TaskFormDialog";
import { createTask } from "@/lib/actions/createDeleteAndUpdateTasks";
import { TaskFormValues } from "@/types/task";
import { toast } from "sonner";

export default function TaskGrid({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryKey = ["tasks", "course", courseId];

  const { data: tasks, isLoading } = useQuery({
    queryKey, queryFn: () => fetchCourseTasks(courseId),
  });

  const createMutation = useMutation({
    mutationFn: (values: TaskFormValues) => createTask({ courseId, ...values }),
    onSuccess: (result) => {
        if (result.success) {
            toast.success("Task created");
            queryClient.invalidateQueries({ queryKey });
            setDialogOpen(false);
        } else toast.error(result.error);
    },
    onError: () => toast.error("Failed to create task"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-[#1C2420]">Tasks</h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#1F6F5C] hover:bg-[#175446]"
        >
          <Plus size={15} className="mr-1.5" />New Task
        </Button>
      </div>

      {isLoading ? (
        <div className="h-46 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
      ) : tasks && tasks.length > 0 ? (
        <div className="flex flex-col gap-3">
            {tasks.map((t) => (
                <TaskCard key={t.id} task={t} queryKey={queryKey} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
            <ListTodo size={22} className="text-[#6B7369]" />
          </div>
          <p className="text-sm text-[#6B7369]">No tasks yet for this course.</p>
        </div>
      )}

      <TaskFormDialog
        key={dialogOpen ? "open" : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialTask={null}
        onSubmit={(values) => createMutation.mutate(values)}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

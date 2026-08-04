"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCourseGrades } from "@/lib/api/fetchGrades";
import { createAssessmentComponent, updateAssessmentComponent,deleteAssessmentComponent, } from "@/lib/actions/gradeActions";
import { AssessmentComponent, GradeCellUpdate, GradeStudentRow } from "@/types/grade";
import { toast } from "sonner";
import { saveGrades } from "@/lib/actions/saveGradeActions";

type PendingKey = string; // `${componentId}:${studentId}`
const EMPTY_COMPONENTS: AssessmentComponent[] = [];
const EMPTY_ROWS: GradeStudentRow[] = [];

export function useGradesTable(courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["grades", "course", courseId];

  const { data, isLoading } = useQuery({
    queryKey, queryFn: () => fetchCourseGrades(courseId),
  });

  const [pending, setPending] = useState<Map<PendingKey, GradeCellUpdate>>(new Map());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<AssessmentComponent | null>(null);

  const componentMutation = useMutation({
    mutationFn: (values: { name: string; maxMarks: number }) =>
      editingComponent ? updateAssessmentComponent(editingComponent.id, values) : createAssessmentComponent(courseId, values),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(editingComponent ? "Column updated" : "Column added");
      queryClient.invalidateQueries({ queryKey });
      setDialogOpen(false);
      setEditingComponent(null);
    },
    onError: () => toast.error("Failed to save column"),
  });

  const deleteMutation = useMutation({
    mutationFn: (componentId: string) => deleteAssessmentComponent(componentId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Column deleted");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to delete column"),
  });

  const saveMutation = useMutation({
    mutationFn: (updates: GradeCellUpdate[]) => saveGrades(courseId, updates),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      if (result.conflicts.length > 0) {
        toast.error(`${result.conflicts.length} cell(s) changed since you loaded the page — refreshed those.`);
      } else {
        toast.success("Grades saved");
      }
      setPending(new Map());
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to save grades"),
  });

  // stores unsaved edits in pending.
  function handleCellChange(componentId: string, studentId: string, currentVersion: number, value: number | null) {
    const key: PendingKey = `${componentId}:${studentId}`;
    setPending((prev) => {
      const next = new Map(prev);
      next.set(key, { componentId, studentId, score: value, version: currentVersion });
      return next;
    });
  }

  function handleSave() {
    if (pending.size === 0) return;
    saveMutation.mutate(Array.from(pending.values()));
  }

  function openNewComponentDialog() {
    setEditingComponent(null);
    setDialogOpen(true);
  }

  function openEditComponentDialog(component: AssessmentComponent) {
    setEditingComponent(component);
    setDialogOpen(true);
  }

  function closeDialog(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingComponent(null);
  }

  const components = data?.components ?? EMPTY_COMPONENTS;
  const rows = data?.rows ?? EMPTY_ROWS;

  // computes each student's total using the displayed values (including unsaved edits).
  const totalsByStudent = useMemo(() => {
    const map = new Map<string, { earned: number; possible: number }>();
    for (const row of rows) {
      let earned = 0, possible = 0;
      for (const c of components) {
        const key: PendingKey = `${c.id}:${row.student_id}`;
        const pendingCell = pending.get(key);
        const score = pendingCell ? pendingCell.score : row.grades[c.id]?.score ?? null;
        if (score !== null) { earned += score; possible += c.max_marks; }
      }
      map.set(row.student_id, { earned, possible });
    }
    return map;
  }, [rows, components, pending]);
  
  // returns the value to display, preferring pending changes over database values.
  function getCellValue(componentId: string, studentId: string) {
    const key: PendingKey = `${componentId}:${studentId}`;
    const pendingCell = pending.get(key);
    const existing = rows.find((r) => r.student_id === studentId)?.grades[componentId];
    return {
      score: pendingCell ? pendingCell.score : existing?.score ?? null,
      version: existing?.version ?? 0,
      hasPendingChange: !!pendingCell,
    };
  }

  return {
    isLoading,
    components,
    rows,
    pending,
    dialogOpen,
    editingComponent,
    totalsByStudent,
    isSavingGrades: saveMutation.isPending,
    isSavingComponent: componentMutation.isPending,
    getCellValue,
    handleCellChange,
    handleSave,
    openNewComponentDialog,
    openEditComponentDialog,
    closeDialog,
    saveComponent: componentMutation.mutate,
    deleteComponent: deleteMutation.mutate,
  };
}
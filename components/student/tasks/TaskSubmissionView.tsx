"use client"
import { FileText } from "lucide-react";
import { StudentTaskDetail } from "@/types/studentTaskDetail";

interface TaskSubmissionViewProps {
  task: StudentTaskDetail;
}

export default function TaskSubmissionView({ task, }: TaskSubmissionViewProps) {
    return (
        <div className="rounded-lg border border-[#DAD7CE] bg-white p-5">
        <h3 className="text-sm font-medium text-[#1C2420] mb-3">
            Your submission
        </h3>
        {task.submission?.text_content && (
            <p className="text-sm text-[#1C2420] whitespace-pre-wrap mb-3">
            {task.submission.text_content}
            </p>
        )}
        {task.submission?.file_url && (
            <a
            href={task.submission.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#1F6F5C] hover:underline"
            >
            <FileText size={14} /> {task.submission.file_name}
            </a>
        )}
        {task.submission?.feedback && (
            <div className="mt-4 pt-4 border-t border-[#DAD7CE]">
            <p className="text-xs font-medium text-[#6B7369] mb-1">Feedback</p>
            <p className="text-sm text-[#1C2420] whitespace-pre-wrap">
                {task.submission.feedback}
            </p>
            </div>
        )}
        </div>
    );
}

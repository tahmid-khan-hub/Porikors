import { StudentResource } from "@/types/resources";
import { FileText, Link as LinkIcon, Video, FolderOpen } from "lucide-react";

const RESOURCE_ICONS: { type: StudentResource["resourceType"]; icon: React.ReactNode }[] = [
    { type: "video_link", icon: <Video size={15} className="text-[#1F6F5C]" /> },
    { type: "pdf", icon: <FileText size={15} className="text-[#1F6F5C]" /> },
    { type: "text", icon: <FileText size={15} className="text-[#1F6F5C]" /> },
    { type: "drive_link", icon: <LinkIcon size={15} className="text-[#1F6F5C]" /> },
    { type: "file", icon: <FolderOpen size={15} className="text-[#1F6F5C]" /> },
];

export default function ResourceCard({ r }: { r: StudentResource }) {
    const isTextResource = r.resourceType === "text";

    const iconEl =
        RESOURCE_ICONS.find((i) => i.type === r.resourceType)?.icon ?? ( <LinkIcon size={15} className="text-[#1F6F5C]" /> );

    const content = (
        <>
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F5F1]">
                {iconEl}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#6B7369]">
                    <span className="font-medium text-[#1C2420]">{r.teacherName}</span>
                    <span>·</span>
                    <span>{r.courseTitle ?? "All courses"}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#1C2420] truncate">{r.title}</p>
                {r.description && (
                    <p className="mt-0.5 text-xs text-[#6B7369] line-clamp-2">{r.description}</p>
                )}
                {isTextResource && r.textContent && (
                    <p className="mt-1.5 text-sm text-[#1C2420] whitespace-pre-wrap line-clamp-3">
                        {r.textContent}
                    </p>
                )}
            </div>
        </>
    );

    if (isTextResource) {
        return (
        <div className="flex gap-3 rounded-lg border border-[#DAD7CE] bg-white p-4">{content}</div>
        );
    }

    return (
        <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg border border-[#DAD7CE] bg-white p-4 hover:border-[#1F6F5C] transition-colors"
            >
            {content}
        </a>
    );
}
"use client"
import { Resource } from "@/types/resources";
import { Video, Link2, File as FileIcon, StickyNote } from "lucide-react";
import ResourceCardMenu from "./ResourceCardMenu";

const iconMap = {
  video_link: Video,
  pdf: FileIcon,
  file: FileIcon,
  drive_link: Link2,
  text: StickyNote,
};

const labelMap = {
  video_link: "Video",
  pdf: "PDF",
  file: "File",
  drive_link: "Drive Link",
  text: "Text",
};

interface ResourceCardProps {
    resource: Resource;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ResourceCard({ resource, onEdit, onDelete, }: ResourceCardProps)  {
    const Icon = iconMap[resource.resource_type];

    return (
        <div className="relative rounded-lg border border-[#DAD7CE] bg-white p-4 hover:shadow-sm transition-shadow">
            {(resource.resource_type === "video_link" || resource.resource_type === "drive_link" ||
            resource.resource_type === "pdf" || resource.resource_type === "file") &&
            resource.url && (
                <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-0"
                    aria-label={resource.title} 
                />
            )}

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 rounded-md bg-[#1F6F5C]/10 p-2 text-[#1F6F5C] shrink-0">
                        <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-medium text-[#1C2420] truncate">{resource.title}</h3>
                        <p className="text-[11px] uppercase tracking-wide text-[#6B7369] mt-0.5">{labelMap[resource.resource_type]}</p>
                        {resource.description && (
                            <p className="text-xs text-[#6B7369] mt-2 line-clamp-2">{resource.description}</p>
                        )}
                        {resource.resource_type === "text" && resource.text_content && (
                            <p className="text-xs text-[#1C2420] mt-2 line-clamp-3">{resource.text_content}</p>
                        )}
                    </div>
                </div>

                <div className="relative z-10">
                    <ResourceCardMenu onEdit={onEdit} onDelete={onDelete} />
                </div>
            </div>
        </div>
    )
}
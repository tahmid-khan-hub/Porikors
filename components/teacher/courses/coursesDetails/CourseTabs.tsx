"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { label: "Announcements", segment: "announcements" },
    { label: "Resources", segment: "resources" },
    { label: "Tasks", segment: "tasks" },
    { label: "Grades", segment: "grades" },
];

export default function CourseTabs({ courseId }: { courseId: string }) {
    const pathname = usePathname();

    return (
        <div className="flex gap-1 border-b border-[#DAD7CE]">
            {TABS.map(({ label, segment }) => {
                const href = `/teacher/courses/${courseId}/${segment}`;
                const isActive = pathname.startsWith(href);
                return (
                    <Link
                        key={segment}
                        href={href}
                        className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
                            isActive
                                ? "border-[#1F6F5C] text-[#1F6F5C] font-medium"
                                : "border-transparent text-[#6B7369] hover:text-[#1C2420]"
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    )
}
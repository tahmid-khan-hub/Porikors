import ResourcesFeed from "@/components/student/resources/ResourcesFeed";

export default function StudentResourcesPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold mt-5 text-[#1C2420]">Resources</h1>
            <ResourcesFeed limit={20} />
        </div>
    );
}
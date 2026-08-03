import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ResourcesGrid from "@/components/teacher/resources/ResourcesGrid";

export default async function TeacherResourcesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="p-3">
      <ResourcesGrid />
    </div>
  );
}
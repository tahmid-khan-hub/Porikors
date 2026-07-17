import AdminSidebar from "@/components/admin/AdminSidebar";
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
        redirect("/404");
    }
    return (
        <div className="flex min-h-screen bg-[#F6F5F1]">
            <AdminSidebar />
            <main className="flex-1 p-8">{children}</main>
        </div>
    )
}
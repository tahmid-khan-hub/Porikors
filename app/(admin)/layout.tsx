import AdminChrome from "@/components/admin/AdminChrome";
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
        redirect("/404");
    }
    return <AdminChrome user={session.user}>{children}</AdminChrome>
}
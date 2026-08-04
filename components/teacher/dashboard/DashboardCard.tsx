"use client"
import { motion } from "framer-motion";

interface DashboardCardProps {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

export default function DashboardCard({ title, action, children }: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-[#DAD7CE] bg-white p-4 transition-colors duration-200 hover:bg-[#1F6F5C]/5 hover:border-[#1F6F5C]/30 hover:shadow-md"
        >
            <div className="mb-1 flex items-center justify-between">
                <h2 className="text-xl mb-2 font-semibold text-[#1C2420]">{title}</h2>
                {action}
            </div>
            {children}
        </motion.div>
    );
}
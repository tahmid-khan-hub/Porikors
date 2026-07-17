"use client";
import { X } from "lucide-react";
import AdminSidebarContent from "./AdminSidebarContent";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    return (
        <>
            <div className="w-64 shrink-0 hidden md:flex md:flex-col  bg-[#12170F] text-[#F6F5F1] min-h-screen">
                <AdminSidebarContent />
            </div>

            {/* mobile drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        />
                        <motion.aside
                        key="drawer"
                        className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-[#12170F] text-[#F6F5F1] md:hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        >
                            <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close menu"
                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-[#B7BDB3] hover:bg-white/5 hover:text-[#F6F5F1]">
                                <X size={18} />
                            </button>
                            <AdminSidebarContent onNavigate={onClose} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

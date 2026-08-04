"use client";
import { fetchVerifications } from "@/lib/api/fetchVerifications";
import { RoleTab } from "@/types/AdminVerification";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerificationCard from "./VerificationCard";
import VerificationCardSkeleton from "./VerificationCardSkeleton";
import VerificationsError from "./VerificationsError";
import VerificationsPending from "./VerificationsPending";

export default function VerificationsList() {
    const [roleTab, setRoleTab] = useState<RoleTab>("all");

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
        queryKey: ["verifications", roleTab],
        queryFn: ({ pageParam }) =>
            fetchVerifications(roleTab === 'all' ? null : roleTab, pageParam),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const items = data?.pages.flatMap((p) => p.items) ?? []

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end mt-5 lg:-mt-5">
                <Tabs value={roleTab} onValueChange={(v) => setRoleTab(v as RoleTab)}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="teacher">Teacher</TabsTrigger>
                        <TabsTrigger value="student">Student</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                            <VerificationCardSkeleton />
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {isError && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <VerificationsError onRetry={() => refetch()} />
                    </motion.div>
                )}

                {!isLoading && !isError && items.length === 0 && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <VerificationsPending />
                    </motion.div>
                )}

                {!isLoading && !isError && items.length > 0 && (
                    <motion.div
                        key={roleTab}
                        className="flex flex-col gap-3"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: { staggerChildren: 0.04 },
                            },
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <VerificationCard verification={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {hasNextPage && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mx-auto rounded-md border border-[#DAD7CE] px-4 py-2 text-sm font-medium text-[#1C2420] hover:bg-[#1C2420]/5 disabled:opacity-50"
                >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                </motion.button>
            )}
        </div>
    )
}
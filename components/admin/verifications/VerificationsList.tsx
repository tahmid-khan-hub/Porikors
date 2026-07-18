"use client";
import { fetchVerifications } from "@/lib/api/fetchVerifications";
import { RoleTab } from "@/types/AdminVerification";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
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
                        <VerificationCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {isError && ( <VerificationsError onRetry={() => refetch()} /> )}

                {!isLoading && !isError && items.length === 0 && (
                    <VerificationsPending />
                )}

            {!isLoading && !isError && (
                <div className="flex flex-col gap-3">
                    {items.map((item) => (
                        <VerificationCard key={item.id} verification={item} />
                    ))}
                </div>
            )}

            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mx-auto rounded-md border border-[#DAD7CE] px-4 py-2 text-sm font-medium text-[#1C2420] hover:bg-[#1C2420]/5 disabled:opacity-50"
                    >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    )
}
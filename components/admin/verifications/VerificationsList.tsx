"use client";
import { fetchVerifications } from "@/lib/api/fetchVerifications";
import { RoleTab } from "@/types/AdminVerification";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VerificationsList() {
    const [roleTab, setRoleTab] = useState<RoleTab>("all");

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ["verifications", roleTab],
        queryFn: ({ pageParam }) =>
            fetchVerifications(roleTab === 'all' ? null : roleTab, pageParam),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const items = data?.pages.flatMap((p) => p.items) ?? []
    return (
        <div className="flex flex-col gap-6">
            <Tabs value={roleTab} onValueChange={(v) => setRoleTab(v as RoleTab)}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                    <TabsTrigger value="student">Student</TabsTrigger>
                </TabsList>
            </Tabs>

            
        </div>
    )
}
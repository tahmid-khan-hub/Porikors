"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StudentCourseResources from "./StudentCourseResources";
import StudentCourseTasks from "./StudentCourseTasks";
import StudentCourseAnnouncements from "./StudentCourseAnnouncements";

export default function StudentCourseTabs({ courseId }: { courseId: string }) {
    const [tab, setTab] = useState("tasks");

    return (
        <Tabs value={tab} onValueChange={setTab} className="flex flex-col gap-4">
            <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
                <StudentCourseTasks courseId={courseId} />
            </TabsContent>
            <TabsContent value="resources">
                <StudentCourseResources courseId={courseId} />
            </TabsContent>
            <TabsContent value="announcements">
                <StudentCourseAnnouncements courseId={courseId} />
            </TabsContent>
        </Tabs>
    );
}
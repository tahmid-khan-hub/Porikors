"use client"

interface TeacherChromeProps {
    user: { name?: string | null; email?: string | null; image?: string | null },
    title?: string;
    children: React.ReactNode;
}

export default function TeacherChrome({ user, title, children } : TeacherChromeProps) {
    return (
        <div>
            
        </div>
    )
}
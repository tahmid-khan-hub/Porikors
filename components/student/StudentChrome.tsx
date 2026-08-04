"use client";

interface StudentChromeProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  title?: string;
  children: React.ReactNode;
}

export default function StudentChrome({ user, title, children, }: StudentChromeProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F5F1]">
        <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

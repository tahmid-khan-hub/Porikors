"use client";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  title?: string;
  onMenuClick: () => void;
}

export default function AdminHeader({ user, title = "Dashboard", onMenuClick }: AdminHeaderProps) {
    return (
        <header>

        </header>
    )
}
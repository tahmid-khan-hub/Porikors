import { FileText, PenLine, Megaphone, ShieldAlert } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Course Management",
    description: "Organize everything in one place, from course materials to weekly reading lists.",
  },
  {
    icon: PenLine,
    title: "Grading Made Easy",
    description: "Speed up feedback with intuitive tools designed for teachers' workflows.",
  },
  {
    icon: Megaphone,
    title: "Announcements & Resources",
    description: "Share important updates instantly with automated notifications for everyone.",
  },
  {
    icon: ShieldAlert,
    title: "Track Deadlines",
    description: "Never miss a submission with smart alerts and integrated course calendars.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#1C2420]">
          Comprehensive Tools for Success
        </h2>
        <p className="mt-3 text-sm text-[#1C2420]/60">
          Everything you need to run a modern classroom, simplified.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-[#DAD7CE] bg-white p-6 shadow-lg hover:shadow-xl hover:cursor-default transition-transform duration-300 hover:scale-104"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F6F5C]/10">
              <Icon className="h-5 w-5 text-[#1F6F5C]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#1C2420]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1C2420]/60">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

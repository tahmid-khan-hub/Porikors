import { CheckCircle2 } from "lucide-react";

const roles = [
  {
    label: "EDUCATORS",
    title: "For Teachers",
    description: "Manage submissions, grade with ease, and organize resources effortlessly. Our platform is built to save you hours of administrative work every week.",
    points: [
      "Batch grading tools",
      "Automated plagiarism checks",
      "Resource repository",
    ],
  },
  {
    label: "LEARNERS",
    title: "For Students",
    description: "Join classes, submit work on time, and track your academic progress. Stay organized with a personalized dashboard tailored to your courses.",
    points: [
      "One-click submissions",
      "Personalized study calendar",
      "Peer discussion boards",
    ],
  },
];

export function RoleHighlight() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {roles.map(({ label, title, description, points }) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-lg border border-[#DAD7CE] bg-white p-8 shadow-lg"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1F6F5C]/5" />

            <span className="relative text-xs font-semibold tracking-wide text-[#1F6F5C]">
              {label}
            </span>

            <h3 className="relative mt-2 text-2xl font-bold text-[#1C2420]">
              {title}
            </h3>

            <p className="relative mt-4 text-sm leading-relaxed text-[#1C2420]/60">
              {description}
            </p>

            <ul className="relative mt-6 space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm text-[#1C2420]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1F6F5C]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

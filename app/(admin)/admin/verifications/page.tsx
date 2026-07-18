import VerificationsList from "@/components/admin/verifications/VerificationsList";

export default function VerificationsPage() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-[#1C2420]">Pending Verifications</h1>
          <p className="text-[#8A8F86] mt-1">Review and verify applications from teachers and students.</p>
        </div>
      </div>

      {/* list of users who applied for a specific role */}
      <VerificationsList />
    </div>
  );
}
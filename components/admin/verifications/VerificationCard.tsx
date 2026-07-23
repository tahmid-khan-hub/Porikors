"use client";
import { Verification } from "@/types/AdminVerification";
import Image from "next/image";
import VerificationCardButtons from "./VerificationCardButtons";

export default function VerificationCard({ verification,}: { verification: Verification }) {
  return (
    <div className="rounded-lg border border-[#DAD7CE] bg-white p-4 transition-colors">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {verification.image ? (
            <Image
              src={verification.image}
              alt=""
              height={16}
              width={16}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 shrink-0 rounded-full bg-[#F6F5F1] border border-[#DAD7CE] flex items-center justify-center text-xs font-medium text-[#1C2420]/60">
              {verification.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-medium text-[#1C2420] truncate">
              {verification.name}
            </p>
            <p className="text-sm text-[#1C2420]/60 truncate">
              {verification.email}
              <span className="mx-1.5 text-[#DAD7CE]">·</span>
              <span className="capitalize">{verification.requested_role}</span>
              <span className="mx-1.5 text-[#DAD7CE]">·</span>
              {verification.institution ?? "No institution given"}
            </p>
          </div>
        </div>

        <VerificationCardButtons verification={verification} />
      </div>
    </div>
  );
}

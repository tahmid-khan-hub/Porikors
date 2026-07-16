import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Ban, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiteHeader } from "@/components/landing/site-header";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);
  const roleStatus = session?.user?.roleStatus;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center bg-[#F6F5F1] px-4">
        <div className="max-w-md w-full rounded-md border border-[#DAD7CE] bg-white shadow-md p-8 text-center">
          {roleStatus === "rejected" ? (
            <>
              <div>
                <div className="rounded-full bg-[#1F6F5C]/10 p-3 w-16 mx-auto">
                  <Ban className="mx-auto text-[#1F6F5C]" size={16} />
                </div>
                <h2 className="text-xl font-semibold text-[#C1443D]">Verification rejected</h2>
                <p className="mt-2 text-[#1C2420]/60">Your application could not be verified. Please review and resubmit.</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="rounded-full bg-[#1F6F5C]/10 p-3 w-16 mx-auto">
                  <Hourglass className="mx-auto text-[#1F6F5C]" size={36} />
                </div>
                <h2 className="text-xl mt-8 font-semibold text-[#1C2420]">Verification pending</h2>
                <p className="mt-2 text-[#1C2420]/60">Your request is under review. We will notify you once it is approved.</p>
              </div>
            </>
          )}

          <Link href={"/"}>
            <Button
              className={ "bg-[#1F6F5C] text-white hover:bg-[#175446] px-5 py-4 mt-6"}>
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

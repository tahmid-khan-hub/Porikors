import { CircleCheck } from "lucide-react";

export default function VerificationsPending() {
    return (
        <div className="max-w-6xl mx-auto p-24 bg-white rounded-lg shadow-md">
            <div className="mb-6 flex justify-center">
                <div className="rounded-full border border-green-200 bg-green-50 p-8">
                    <div className="flex h-24 w-24 p-6 items-center justify-center rounded-full bg-[#1F6F5C]">
                        <CircleCheck className="h-8 w-8 text-white" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-center">
                <h3 className="text-3xl text-black">No pending requests</h3>
                <p className="mt-3 mb-6 text-sm text-gray-400 max-w-md mx-auto">There are currently no verification requests awaiting review. Check back later for new submissions.</p>
            </div>
        </div>
    )
}
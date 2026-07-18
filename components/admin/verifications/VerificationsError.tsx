import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCw } from "lucide-react";

export default function VerificationsError({ onRetry }:{ onRetry?: () => void }) {
    return (
        <div className="max-w-6xl mx-auto p-24 bg-white rounded-lg shadow-md">
            <div className="mb-6 flex justify-center">
                <div className="rounded-full border border-red-200 bg-red-50 p-8">
                    <div className="flex h-24 w-24 p-6 items-center justify-center rounded-full bg-red-700">
                        <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-center">
                <h3 className="text-3xl text-black">Something went wrong</h3>
                <p className="mt-3 mb-6 text-sm text-gray-400 max-w-md mx-auto">We encountered an error while fetching the verification queue. Please try again.</p>
                {onRetry && (
                    <Button 
                        className={"w-28 mx-auto"}
                        onClick={onRetry}
                    >
                        <RotateCw />
                        <span className="mt-[0.5px]">Try again</span>
                    </Button>
                )}
            </div>
        </div>
    )
}
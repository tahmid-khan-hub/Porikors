import { Suspense } from "react";
import RegisterPageClientSide from "./components/RegisterPageClientSide";
import RegisterPageSkeleton from "./components/RegisterPageSkeleton";

export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterPageSkeleton />}>
            <RegisterPageClientSide />
        </Suspense>
    )
}
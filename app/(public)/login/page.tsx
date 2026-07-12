import { Suspense } from "react";
import LoginPageClientSide from "./components/LoginPageClientSide";
import LoginPageSkeleton from "./components/LoginPageSkeleton";

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginPageSkeleton />}>
            <LoginPageClientSide />
        </Suspense>
    )
}
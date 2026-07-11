import { Suspense } from "react";
import LoginPageClientSide from "./components/LoginPageClientSide";

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageClientSide />
        </Suspense>
    )
}
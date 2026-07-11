import { Suspense } from "react";
import RegisterPageClientSide from "./components/RegisterPageClientSide";

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterPageClientSide />
        </Suspense>
    )
}
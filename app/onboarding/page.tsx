import { Suspense } from "react";
import OnBoardingClientSide from "./components/OnBoardingClientSide";

export default function OnboardingPage() {
  return (
    <Suspense>
        <OnBoardingClientSide />
    </Suspense>
  );
}

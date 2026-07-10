import { FeaturesGrid } from "@/components/landing/features-grid";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RoleHighlight } from "@/components/landing/role-highlight";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <FeaturesGrid />
            <HowItWorks />
            <RoleHighlight />
        </>
    )
}
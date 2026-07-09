import { FeaturesGrid } from "@/components/landing/features-grid";
import { Hero } from "@/components/landing/hero";
import { RoleHighlight } from "@/components/landing/role-highlight";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <FeaturesGrid />
            <RoleHighlight />
        </>
    )
}
import { Home } from "@/components/sections/home/Home";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { Help } from "@/components/sections/home/Help";
import { Popular } from "@/components/sections/home/Popular";
import { Travel } from "@/components/sections/home/Travel";
import { Footer } from "@/components/shared/widgets/Footer";
import { WhyUs } from "@/components/sections/home/WhyUs";

export const HomePage = () => {
    return (
        <>
            <Home />
            <HowItWorks />
            <Help />
            <WhyUs />
            <Popular />
            <Travel />
            <Footer />
        </>
    );
};
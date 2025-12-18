import { Help } from "@/components/pages/home/Help";
import { Home } from "@/components/pages/home/Home";
import { HowItWorks } from "@/components/pages/home/HowItWorks";
import { Popular } from "@/components/pages/home/Popular";
import { Travel } from "@/components/pages/home/Travel";
import { WhyUs } from "@/components/pages/home/WhyUs";
import { Footer } from "@/components/shared/widgets/Footer";

const Page = () => {
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

export default Page;
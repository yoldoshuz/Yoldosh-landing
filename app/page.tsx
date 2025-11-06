import { Home } from "@/components/pages/Home";
import { HowItWorks } from "@/components/pages/HowItWorks";
import { Help } from "@/components/pages/Help";
import { Popular } from "@/components/pages/Popular";
import { Travel } from "@/components/pages/Travel";
import { Footer } from "@/components/shared/Footer";

const Page = () => {
  return (
    <>
      <Home />
      <HowItWorks />
      <Help />
      <Popular />
      <Travel />
      <Footer />
    </>
  );
};

export default Page;
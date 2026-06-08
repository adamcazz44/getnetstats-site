import SiteHeader from "@/components/SiteHeader";
import HeroTool from "@/components/HeroTool";
import HowItWorks from "@/components/HowItWorks";
import RelatedTools from "@/components/RelatedTools";
import Education from "@/components/Education";
import FAQSection from "@/components/FAQSection";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroTool />
        <div className="wrap">
          <hr className="divider" />
        </div>
        <HowItWorks />
        <div className="wrap">
          <hr className="divider" />
        </div>
        <RelatedTools />
        <div className="wrap">
          <hr className="divider" />
        </div>
        <Education />
        <div className="wrap">
          <hr className="divider" />
        </div>
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}

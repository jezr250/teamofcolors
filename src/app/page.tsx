import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceTriptych from "@/components/ServiceTriptych";
import AboutSection from "@/components/AboutSection";
import LookSection from "@/components/LookSection";
import OrderSection from "@/components/OrderSection";
import WorksSection from "@/components/WorksSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Artizan 忠実再現構成 */}
        <Hero />              {/* フル画面 — is genuine works */}
        <ServiceTriptych />   {/* 3分割サービスタイル */}
        <AboutSection />      {/* WORK & BELIEF */}
        <LookSection />       {/* LOOK — パラックスポートフォリオ */}
        <OrderSection />      {/* ORDER — フルスクラッチCTA */}
        <WorksSection />      {/* WORKS — 施工実績ギャラリー（代表6件ハードコード） */}
        <Contact />           {/* CONTACT */}
      </main>
      <Footer />
    </>
  );
}

import Footer from "@/components/main/Footer";
import Hero from "@/components/main/Hero";
import Hero2 from "@/components/main/Hero2";
import LatestArticles from "@/components/main/LatestArticles";
import LatestArticlesGrid from "@/components/main/LatestArticlesGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      <LatestArticles />
      <LatestArticlesGrid/>
      <Hero2 />
      <Footer />
    </main>
  );
}

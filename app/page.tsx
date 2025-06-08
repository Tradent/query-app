import SearchHero from "@/components/search-hero"
import FeatureSection from "@/components/feature-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <SearchHero />
        <FeatureSection />
      </div>
    </main>
  )
}

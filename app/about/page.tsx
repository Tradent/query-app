import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Query-SE</h1>

        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-center mb-12">
            Query-SE is revolutionizing the way we search and interact with information on the web through blockchain
            technology.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Our Mission</h2>
          <p>
            At Query-SE, we're building the next generation of search technology that combines the power of blockchain
            with advanced search algorithms. Our mission is to create a more transparent, efficient, and user-centric
            search experience that respects privacy while delivering superior results.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">The Technology</h2>
          <p>
            Query-SE is built on Solana's high-performance blockchain, enabling us to process thousands of search
            queries per second with minimal latency. Our architecture leverages:
          </p>

          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Solana's Rust-based smart contracts for secure, efficient data processing</li>
            <li>Next.js and React for a responsive, modern frontend experience</li>
            <li>Peer-to-peer validation networks to ensure search result accuracy</li>
            <li>Advanced cryptographic techniques to protect user privacy</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <Card>
              <CardHeader>
                <CardTitle>Alex Rivera</CardTitle>
                <CardDescription>Founder & CEO</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Former search engineer at Google with expertise in distributed systems and blockchain technology.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sophia Chen</CardTitle>
                <CardDescription>CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Blockchain architect with 8+ years of experience building decentralized applications and protocols.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marcus Johnson</CardTitle>
                <CardDescription>Head of Research</CardDescription>
              </CardHeader>
              <CardContent>
                <p>PhD in Information Retrieval with a focus on semantic search and natural language processing.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Elena Petrova</CardTitle>
                <CardDescription>Lead Frontend Engineer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Expert in React and Next.js with a passion for creating intuitive, accessible user interfaces.</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">Join the Revolution</h2>
          <p>
            We're just getting started on our mission to transform how the world searches for information. Join us as we
            build the future of search technology powered by blockchain.
          </p>

          <div className="text-center mt-12">
            <p className="text-lg font-medium">Interested in learning more or joining our team?</p>
            <p className="text-purple-600 font-medium">contact@query-se.com</p>
          </div>
        </div>
      </div>
    </main>
  )
}

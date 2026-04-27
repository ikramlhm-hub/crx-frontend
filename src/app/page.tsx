import Header from '../components/Header'
import Hero from '../components/Hero'
import Spotlight from '../components/Spotlight'
import Articles from '../components/Articles'
import ValueProposition from '../components/ValueProposition'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Spotlight />
      <Articles />
      <ValueProposition />
      <Newsletter />
      <Footer />
    </main>
  )
}
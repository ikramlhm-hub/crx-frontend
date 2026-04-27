export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] text-white overflow-hidden">
      <img src="/icons/hero.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/60 to-white/100"></div>
      <div className="relative z-10 px-8 md:px-20 pt-40 space-y-6">
        <h1 className="font-poppins font-bold text-3xl md:text-5xl leading-none max-w-[712px]">
          L&apos;indépendance a du style
        </h1>
        <p className="text-lg text-gray-200 max-w-xl">
          Un espace pensé pour les créateurs indépendants, pour mettre en lumière leur style, leurs histoires et leurs pièces uniques.
        </p>
        <button className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-semibold text-black shadow-md">
          Je découvre
        </button>
      </div>
    </section>
  )
}
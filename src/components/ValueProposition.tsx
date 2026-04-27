import Link from 'next/link'

export default function ValueProposition() {
  return (
    <section className="w-full bg-white py-28 flex flex-col items-center px-6">
      <h2 className="font-poppins font-black text-[40px] leading-[100%] text-black text-center">
        Notre raison d&apos;être
      </h2>
      <p className="mt-8 max-w-3xl text-center text-[18px] leading-relaxed text-black font-medium">
        Nous aidons les créateurs indépendants à exister réellement sur le marché.
        Face à la domination de la fast-fashion et au manque de visibilité, nous offrons une marketplace pensée pour révéler leurs univers,
        mettre en avant leurs identités graphiques et connecter leurs stocks en toute fluidité.
      </p>
      <Link href="/register">
        <button className="mt-24 bg-white text-black font-poppins font-semibold text-[22px] px-16 py-5 rounded-xl shadow-lg border-2 border-black hover:opacity-90 transition">
          Devenons partenaires
        </button>
      </Link>
    </section>
  )
}
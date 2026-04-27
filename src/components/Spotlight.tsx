'use client'

import Image from 'next/image'

const products = [
  { id: 1, name: 'VESTE', price: '30.00 €', img: '/icons/model1.png', desc: 'Veste streetwear légère et résistante.' },
  { id: 2, name: 'ENSEMBLE', price: '75.00 €', img: '/icons/model2.png', desc: 'Ensemble moderne, confortable et stylé.' },
  { id: 3, name: 'DEBARDEUR', price: '45.00 €', img: '/icons/model3.png', desc: 'Débardeur minimaliste en coton premium.' },
]

export default function Spotlight() {
  return (
    <section className="w-full bg-white pt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-8 md:px-20 pb-6 gap-4">
        <h2 className="font-poppins font-black text-[24px] sm:text-[32px] md:text-[40px] leading-tight text-black">
          SPOTLIGHT DU MOMENT – KREATEUR
        </h2>
        <div className="flex items-center gap-4 self-end md:self-auto">
          <Image src="/icons/arrow-left.png" width={40} height={40} alt="left" />
          <Image src="/icons/arrow-right.png" width={40} height={40} alt="right" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full min-h-[60vh] md:min-h-screen">
        {products.map((p) => (
          <div key={p.id} className="relative w-full md:flex-1 h-[60vh] md:h-auto overflow-hidden">
            <Image src={p.img} alt={p.name} fill className="object-cover object-center" />
            <div className="absolute bottom-0 right-0 w-full p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent text-white text-right">
              <h3 className="font-poppins text-base sm:text-lg font-bold">{p.name}</h3>
              <p className="font-poppins text-xs sm:text-sm text-white/90 mt-1">{p.desc}</p>
              <p className="font-semibold mt-2">{p.price}</p>
              <button className="mt-3 flex items-center justify-center gap-2 bg-white px-4 py-2 text-sm font-semibold rounded text-black w-full sm:w-auto ml-auto">
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
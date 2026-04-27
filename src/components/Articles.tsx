'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = ['Casual', 'Streetwear', 'Elegant', 'Bohème']

const articles = [
  { id: 'cmohqiv0s0009g8u1zip5y7e4', img: '/icons/articles/article1.png', title: 'KREATEUR', description: 'Basé à Paris, KREATEUR est spécialisé en mode streetwear.', real: true },
  { id: '2', img: '/icons/articles/article2.png', title: 'CLEA.TION', description: 'Paragraphe sur CleaTion', real: false },
  { id: '3', img: '/icons/articles/article3.png', title: 'MARK', description: 'Paragraphe sur Mark', real: false },
  { id: '4', img: '/icons/articles/article4.png', title: 'SAKU HIN', description: 'Paragraphe sur Saku Hin', real: false },
  { id: '5', img: '/icons/articles/article5.png', title: 'DEZA INA', description: 'Paragraphe sur Deza Ina', real: false },
  { id: '6', img: '/icons/articles/article6.png', title: 'FA.XION', description: 'Paragraphe sur Fa.XION', real: false },
]

export default function Articles() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mb-16 flex items-center justify-between px-6 md:px-12 lg:px-20">
        <div className="flex flex-wrap gap-6">
          {categories.map((cat) => (
            <button key={cat} className="font-poppins bg-black text-white px-10 py-2 text-sm rounded-md font-semibold shadow-sm">
              {cat}
            </button>
          ))}
        </div>
        <button className="font-poppins bg-white text-black px-10 py-2 text-sm rounded-md font-semibold shadow-md border-2 border-black hover:opacity-90 transition">
          Voir tous
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6 md:px-12 lg:px-20">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col">
            <div className="relative w-full aspect-square rounded-md overflow-hidden">
              <Image
                src={article.img}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                <h3 className="font-poppins text-lg font-semibold">{article.title}</h3>
                <p className="font-poppins text-sm mt-1 leading-relaxed">{article.description}</p>
              </div>
            </div>

            {article.real ? (
              <Link href={`/products/${article.id}`}>
                <button className="font-poppins w-[217px] mt-4 flex items-center justify-center gap-2 bg-[#FFFFFF] px-5 py-2 text-sm font-semibold text-black border-2 rounded-md shadow-md">
                  Voir la vitrine
                </button>
              </Link>
            ) : (
              <button className="font-poppins w-[217px] mt-4 flex items-center justify-center gap-2 bg-[#FFFFFF] px-5 py-2 text-sm font-semibold text-black border-2 rounded-md shadow-md opacity-50 cursor-not-allowed">
                Bientôt disponible
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
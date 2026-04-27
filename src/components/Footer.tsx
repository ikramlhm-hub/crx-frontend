import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-[#F2F2F2] py-16">
      <div className="mx-auto max-w-6xl flex flex-col gap-16 px-6 md:flex-row md:justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide">AIDE & SUPPORT</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            <li>Service client & contact</li>
            <li>FAQ</li>
            <li>Livraison & expédition</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide">A PROPOS</h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            <li>Qui sommes-nous</li>
            <li>Devenir vendeur partenaire</li>
          </ul>
        </div>
        <div className="md:text-right">
          <h3 className="text-sm font-semibold tracking-wide">TROUVEZ-NOUS ICI</h3>
          <div className="mt-4 flex items-center gap-4 md:justify-end">
            <a href="#" aria-label="Instagram"><Image src="/icons/instagram.png" alt="Instagram" width={28} height={28} /></a>
            <a href="#" aria-label="LinkedIn"><Image src="/icons/linkedin.png" alt="LinkedIn" width={28} height={28} /></a>
            <a href="#" aria-label="Facebook"><Image src="/icons/facebook.png" alt="Facebook" width={28} height={28} /></a>
          </div>
        </div>
      </div>
      <div className="mt-14 flex flex-wrap justify-center gap-4 text-xs text-black/60">
        <span>2025 CRX | All rights reserved</span>
        <span className="hidden md:block">|</span>
        <span>Politique de confidentialité</span>
        <span className="hidden md:block">|</span>
        <span>Conditions générales & mentions légales</span>
      </div>
    </footer>
  )
}
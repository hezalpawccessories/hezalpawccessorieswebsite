"use client"

import React, { useMemo } from 'react'
import Image from 'next/image'

export default function ImageAutoSlider() {
  const happyPetItems = useMemo(() => [
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/287312017_440724157868763_8123535573385101371_n_gbsokk.jpg', title: 'Happy Pet 1' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/241312174_534383720955271_3438449773866577894_n_zzvg77.jpg', title: 'Pawfully.yours' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/286480875_377847924328079_4008121744032669407_n_y7jqmg.jpg', title: 'Happy Pet 3' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963916/327548327_3177782035866949_179112891589676750_n_o9jcdi.jpg', title: 'Happy Pet 4' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963915/322924510_142221248631298_4512437418189425826_n_dhm5me.jpg', title: 'Happy Pet 5' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963915/290007258_179777054478160_4353043592713499427_n_rg9yaq.jpg', title: 'Happy Pet 6' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/287312017_440724157868763_8123535573385101371_n_gbsokk.jpg', title: 'Happy Pet 7' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/283434743_153422697190659_4480803216439245309_n_mo28gg.jpg', title: 'Happy Pet 8' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/278460836_1513183882416940_690120010142730407_n_cz83fa.jpg', title: 'zolathechonkygal' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/266275373_624245152032151_9028644669941105180_n_pjddcu.jpg', title: 'Happy Pet 10' },
    { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/272174770_614123276361632_1171529176954943132_n_zehqi5.jpg', title: 'Happy Pet 11' },
  ], [])

  const duplicatedItems = useMemo(() => {
    const imgs = happyPetItems.map(i => ({ src: i.src, title: i.title }))
    return [...imgs, ...imgs]
  }, [happyPetItems])

  const BLUR_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><rect width='10' height='10' fill='%23f3f4f6'/></svg>"

  return (
    <>
      <style>{`
        @keyframes scroll-right { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .infinite-scroll { animation: scroll-right 20s linear infinite; }
        .scroll-container { mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%); -webkit-mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%); }
        .image-item { transition: transform 0.25s ease, filter 0.25s ease; }
        .image-item:hover { transform: scale(1.03); filter: brightness(1.02); }
      `}</style>

      <div className="w-full relative overflow-hidden flex items-center justify-center py-8">
        <div className="relative z-10 w-full flex items-center justify-center py-8">
          <div className="scroll-container w-full max-w-6xl">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedItems.map((item, index) => (
                <div key={index} className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-sm relative">
                  {/* Badge / Pill overlay */}
                  <div className="absolute bottom-2 left-3 md:top-2 md:left-2 z-20">
                    <span className="inline-block bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm drop-shadow-sm">
                      {item.title}
                    </span>
                  </div>
                  <Image src={item.src} alt={item.title || `Happy pet ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 6rem, (max-width: 1024px) 8rem, 12rem" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} quality={60} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

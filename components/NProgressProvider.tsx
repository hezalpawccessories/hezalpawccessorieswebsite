'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import Loader from './Loader'

export default function NProgressProvider() {
   const pathname = usePathname()
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      NProgress.start()
      setLoading(true)
      const timeout = setTimeout(() => {
         NProgress.done()
         setLoading(false)
      }, 700) // Adjust duration as needed

      return () => clearTimeout(timeout)
   }, [pathname])

   return loading ? <Loader /> : null
}

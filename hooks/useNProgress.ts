'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({
  showSpinner: true,
  speed: 300,
  minimum: 0.08,
  easing: 'ease',
  trickleSpeed: 200
})

export const useNProgressRouter = () => {
  const router = useRouter()

  const pushWithProgress = (href: string) => {
    NProgress.start()
    router.push(href)
  }

  const replaceWithProgress = (href: string) => {
    NProgress.start()
    router.replace(href)
  }

  const backWithProgress = () => {
    NProgress.start()
    router.back()
  }

  const forwardWithProgress = () => {
    NProgress.start()
    router.forward()
  }

  return {
    push: pushWithProgress,
    replace: replaceWithProgress,
    back: backWithProgress,
    forward: forwardWithProgress,
    refresh: router.refresh,
    prefetch: router.prefetch
  }
}

export default useNProgressRouter

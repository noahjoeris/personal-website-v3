'use client'

import { useEffect, useState } from 'react'

type BlogReadingProgressProps = {
  articleId: string
}

export function BlogReadingProgress({ articleId }: BlogReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrameId = 0

    function updateProgress() {
      const article = document.getElementById(articleId)
      if (!article) {
        return
      }

      const articleTop = article.getBoundingClientRect().top + window.scrollY
      const articleEnd = articleTop + article.offsetHeight
      const readableDistance = Math.max(articleEnd - articleTop - window.innerHeight, 1)
      const nextProgress = Math.min(Math.max((window.scrollY - articleTop) / readableDistance, 0), 1)

      setProgress(nextProgress)
    }

    function scheduleUpdate() {
      window.cancelAnimationFrame(animationFrameId)
      animationFrameId = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [articleId])

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-0.5 bg-foreground/8">
      <div
        className="h-full origin-left bg-primary transition-transform duration-100 motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

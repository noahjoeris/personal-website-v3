'use client'

import Giscus from '@giscus/react'

type BlogCommentsProps = {
  slug: string
}

export function BlogComments({ slug }: BlogCommentsProps) {
  const discussionTerm = `blog:${slug}`

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="mx-auto mt-16 max-w-2xl border-t border-foreground/15 pt-10"
    >
      <h2 id="comments-heading" className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
        Comments
      </h2>
      <div className="mt-6">
        <Giscus
          key={discussionTerm}
          id="giscus-comments"
          repo="noahjoeris/personal-website-v3"
          repoId="R_kgDOR4EFQA"
          category="Comments"
          categoryId="DIC_kwDOR4EFQM4DBWZ1"
          mapping="specific"
          term={discussionTerm}
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="transparent_dark"
          lang="en"
          loading="lazy"
        />
      </div>
    </section>
  )
}

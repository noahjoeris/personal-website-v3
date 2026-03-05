import { quoteData } from '@/data/quote-data'

export function QuoteSection() {
  const { text, author } = quoteData

  return (
    <section className="flex min-h-[80vh] items-center bg-background px-6 py-24 tablet:px-10 tablet:py-28 desktop:min-h-screen desktop:px-16 desktop:py-36">
      <div className="mx-auto w-full max-w-6xl text-center">
        <blockquote className="text-balance text-4xl leading-[1.1] tracking-[0.01em] text-foreground/90 tablet:text-6xl">
          {text}
        </blockquote>
        <p className="mt-10 text-[1.35rem] tracking-wide text-muted-foreground tablet:text-[2rem]">{author}</p>
      </div>
    </section>
  )
}

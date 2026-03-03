import { quoteData } from '@/data/quote-data'

export function QuoteSection() {
  const { text, author } = quoteData

  return (
    <section className="flex min-h-[80vh] items-center bg-background px-6 py-24 md:px-10 md:py-28 lg:min-h-screen lg:px-16 lg:py-36">
      <div className="mx-auto w-full max-w-6xl text-center">
        <blockquote className="text-balance text-4xl leading-[1.1] tracking-[0.01em] text-foreground/90 md:text-6xl">
          {text}
        </blockquote>
        <p className="mt-10 text-[1.35rem] tracking-wide text-muted-foreground md:text-[2rem]">{author}</p>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { Fragment } from 'react'

import { AnimatedDivider } from '@/components/animated-divider'
import { workHistoryData } from '@/data/work-history-data'

export function WorkHistorySection() {
  const titleLines = workHistoryData.title.split(' ')

  return (
    <section className="overflow-hidden bg-background px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto w-full max-w-9xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:pt-4">
            <h2 className="max-w-xs uppercase text-6xl text-foreground sm:text-7xl md:text-[clamp(5.2rem,12vw,14rem)] pr-2 tracking-tight">
              {titleLines.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-8">
            {workHistoryData.items.map((item, index) => (
              <Fragment key={`${item.company}-${item.duration}`}>
                <article className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-7">
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-foreground/20 bg-black/40 md:h-12 md:w-12">
                      <Image
                        src={item.imgUrl}
                        alt={`${item.company} logo`}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>

                    <div className="space-y-1 uppercase">
                      <p className="text-xl leading-tight text-foreground/70 md:text-2xl">{item.company}</p>
                      <p className="text-xl leading-none text-foreground md:text-2xl">{item.position}</p>
                    </div>
                  </div>

                  <p className="self-end text-right text-xl text-foreground/90 uppercase md:self-auto md:text-2xl lg:text-2xl">
                    {item.duration}
                  </p>
                </article>

                <AnimatedDivider className="bg-foreground/30" delay={index * 0.06} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

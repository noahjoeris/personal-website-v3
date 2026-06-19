import Image from 'next/image'
import { Fragment } from 'react'

import { AnimatedDivider } from '@/components/animated-divider'
import { Section } from '@/components/section'
import { workHistoryData } from '@/data/work-history-data'

export function WorkHistorySection() {
  const titleLines = workHistoryData.title.split(' ')

  return (
    <Section>
      <div className="mx-auto w-full max-w-9xl">
        <div className="grid gap-10 desktop:grid-cols-12 desktop:gap-12">
          <div className="desktop:col-span-4 desktop:pt-4">
            <h2 className="max-w-xs uppercase text-6xl text-foreground tablet:text-[clamp(5.2rem,12vw,14rem)] pr-2 tracking-tight">
              {titleLines.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="desktop:col-span-8">
            {workHistoryData.items.map((item, index) => (
              <Fragment key={`${item.company}-${item.duration}`}>
                <article className="flex flex-col gap-4 py-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-6 tablet:py-7">
                  <div className="flex items-start gap-4 tablet:gap-5">
                    {/* Inline `position` safeguards against Tailwind not applying: a fill image
                        without a positioned ancestor would cover the whole viewport. */}
                    <div
                      style={{ position: 'relative' }}
                      className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-foreground/20 bg-black/40 tablet:h-12 tablet:w-12"
                    >
                      <Image
                        src={item.imgUrl}
                        alt={`${item.company} logo`}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>

                    <div className="space-y-1 uppercase">
                      <p className="text-xl leading-tight text-foreground/70 tablet:text-2xl">{item.company}</p>
                      <p className="text-xl leading-none text-foreground tablet:text-2xl">{item.position}</p>
                    </div>
                  </div>

                  <p className="self-end text-right text-xl text-foreground/90 uppercase tablet:self-auto tablet:text-2xl">
                    {item.duration}
                  </p>
                </article>

                <AnimatedDivider className="bg-foreground/30" delay={index * 0.06} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

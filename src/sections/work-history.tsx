import { AnimatedDivider } from '@/components/animated-divider'
import { Section } from '@/components/section'
import { type WorkHistoryItem, workHistoryData } from '@/data/work-history-data'
import { cn } from '@/lib/utils'

type WorkPeriodProps = Pick<WorkHistoryItem, 'startYear' | 'endYear'>

function WorkPeriod({ startYear, endYear }: WorkPeriodProps) {
  const isCurrent = endYear === 'present'
  const isSingleYear = endYear === startYear
  const accessiblePeriod = isCurrent
    ? `${startYear} to present`
    : isSingleYear
      ? String(startYear)
      : `${startYear} to ${endYear}`

  return (
    <span className="whitespace-nowrap">
      <span className="sr-only">{accessiblePeriod}</span>
      <span aria-hidden="true">
        <time dateTime={String(startYear)}>{startYear}</time>
        {!isSingleYear && (
          <>
            <span>—</span>
            {isCurrent ? <span>NOW</span> : <time dateTime={String(endYear)}>{endYear}</time>}
          </>
        )}
      </span>
    </span>
  )
}

export function WorkHistorySection() {
  const titleLines = workHistoryData.title.split(' ')

  return (
    <Section aria-labelledby="work-history-title">
      <div className="mx-auto w-full max-w-9xl">
        <div className="grid gap-12 desktop:grid-cols-12 desktop:gap-12">
          <header className="min-w-0 desktop:col-span-5 desktop:pt-4">
            <h2
              id="work-history-title"
              className="max-w-xs pr-2 text-6xl font-bold leading-[0.82] tracking-[-0.035em] text-foreground uppercase tablet:text-[clamp(5.2rem,12vw,14rem)]"
            >
              {titleLines.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </header>

          <ol className="min-w-0 border-t border-foreground/30 desktop:col-span-7">
            {workHistoryData.items.map((item, index) => {
              const isCurrent = item.endYear === 'present'

              return (
                <li key={`${item.company}-${item.startYear}`}>
                  <article className="py-6 tablet:py-7 desktop:py-8">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <h3 className="text-xl font-medium leading-none text-foreground/70 uppercase tablet:text-2xl">
                        {item.company}
                      </h3>

                      <div className="flex items-center gap-2 pt-0.5 font-mono text-[0.65rem] font-medium tracking-[0.08em] text-foreground/75 uppercase tablet:text-xs">
                        <WorkPeriod startYear={item.startYear} endYear={item.endYear} />
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 text-primary-light">
                            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary-light" />
                            <span className="sr-only tablet:not-sr-only">Active</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={cn(
                        'mt-2 max-w-2xl text-[clamp(1.65rem,4.5vw,2.5rem)] font-semibold leading-[0.9] tracking-[-0.025em] uppercase',
                        isCurrent ? 'text-primary-light' : 'text-foreground',
                      )}
                    >
                      {item.position}
                    </p>
                  </article>

                  <AnimatedDivider
                    className={isCurrent ? 'bg-primary-light/70' : 'bg-foreground/30'}
                    delay={index * 0.06}
                  />
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}

import { PageLayout } from '@/components/layout/page-layout'
import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { changelogPageContent } from '@/data/content/changelog-content'

const MOBILE_STUB_CLASS =
  'absolute left-1/2 h-3 w-px -translate-x-1/2 border-l border-dashed border-border'

/** Shown while the changelog loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={changelogPageContent.title}
      subtitle={changelogPageContent.subtitle}
      footerText="That's everything shipped so far. This page writes itself, one commit at a time."
    >
      <div className="relative">
        {Array.from({ length: 3 }).map((_, index) => {
          const isFirst = index === 0

          return (
            <div key={index} className="relative pb-3 sm:pb-6 sm:pl-8">
              <div
                aria-hidden
                className={`absolute bottom-0 left-[9.5px] hidden w-px border-l border-dashed border-border sm:block ${
                  isFirst ? 'top-3' : 'top-0'
                }`}
              />

              <div className="absolute left-0 top-0.5 z-10 hidden bg-background text-muted-foreground/40 sm:block">
                <Icons.gitCommit className="size-5" />
              </div>

              <div className="flex items-center gap-2 pt-0.5 font-mono text-[13px] text-muted-foreground/40">
                <span className="relative inline-flex sm:hidden">
                  {!isFirst && (
                    <span
                      aria-hidden
                      className={`${MOBILE_STUB_CLASS} bottom-[calc(50%_+_10px)]`}
                    />
                  )}
                  <Icons.gitCommit className="size-5" />
                  <span aria-hidden className={`${MOBILE_STUB_CLASS} top-[calc(50%_+_10px)]`} />
                </span>
                <Skeleton className="h-4 w-44 rounded bg-surface-30" />
              </div>

              <div className="-mx-2 mt-4 space-y-1 sm:-mx-3 sm:mt-1">
                {Array.from({ length: index === 0 ? 3 : 2 }).map((_, commitIdx) => (
                  <div
                    key={commitIdx}
                    className="flex flex-col justify-between gap-1.5 rounded-xl px-2 py-1.5 sm:flex-row sm:items-start sm:gap-4 sm:px-3 sm:py-2"
                  >
                    <Skeleton className="h-4 w-3/5 rounded bg-surface-30" />
                    <Skeleton className="h-3.5 w-16 rounded bg-surface-20" />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}

import { Fragment, type ReactNode } from 'react'
import { PROJECT_GRID_CLASS, ProjectCardSkeleton } from '@/components/skeletons/project-card'
import {
  HERO_ROW_CLASS,
  SkeletonButton,
  SkeletonField,
  SkeletonPostList,
  SkeletonSectionTitle,
  SkeletonTimelineList,
} from '@/components/skeletons/shared'
import { SKILL_CHIP_WIDTHS, SkillCardSkeleton } from '@/components/skeletons/skill-card'
/* import { TestimonialCardSkeleton } from '@/components/skeletons/testimonial-card' */
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { LANDING_SECTIONS, type LandingSection } from '@/constants/landing'

/**
 * Shown while the landing page loads, laid out to match it so nothing shifts when the real content
 * arrives. Drawn from the same running order the page uses, so a section removed there leaves here.
 *
 * Sits inside the home route group rather than at the root of app, which is what keeps it to this
 * one page. A loading file at the root is the fallback for every route beneath it, so a skeleton
 * shaped like the landing page would appear over the projects grid, the blogs list and the rest.
 */
export default function Loading() {
  /** One shape per section of the page, keyed by the same names its running order uses */
  const skeletons: Record<LandingSection, ReactNode> = {
    hero: <HeroSkeleton />,
    skills: (
      <CarouselSkeleton>
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={row} className="flex gap-2 pl-2">
            {Array.from({ length: 9 }).map((_, chip) => (
              <SkillCardSkeleton
                key={chip}
                width={SKILL_CHIP_WIDTHS[(row + chip) % SKILL_CHIP_WIDTHS.length]}
              />
            ))}
          </div>
        ))}
      </CarouselSkeleton>
    ),
    experience: <TimelineSectionSkeleton titleWidth="w-44" />,
    /* volunteer: <TimelineSectionSkeleton titleWidth="w-36" />, */
    technicalTraining: <TimelineSectionSkeleton titleWidth="w-52" />,
    featuredProjects: (
      <section className="space-y-8">
        <SkeletonSectionTitle className="w-48" />
        <div className={PROJECT_GRID_CLASS}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
        <Skeleton tone="muted" className="h-3.5 w-28" />
      </section>
    ),
    featuredPosts: (
      <section className="space-y-6">
        <SkeletonSectionTitle className="w-40" />
        <SkeletonPostList rows={3} />
        <Skeleton tone="muted" className="h-3.5 w-24" />
      </section>
    ),
    /* testimonials: (
      <CarouselSkeleton>
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={row} className="flex gap-2 pl-2">
            {Array.from({ length: 3 }).map((_, card) => (
              <TestimonialCardSkeleton key={card} className="w-100 shrink-0" />
            ))}
          </div>
        ))}
      </CarouselSkeleton>
    ), */
    education: <TimelineSectionSkeleton titleWidth="w-32" rows={2} />,
    achievements: <TimelineSectionSkeleton titleWidth="w-40" rows={2} />,
    certifications: <TimelineSectionSkeleton titleWidth="w-44" rows={2} />,
    bookmarks: <TimelineSectionSkeleton titleWidth="w-36" rows={2} />,
    newsletter: (
      <section className="space-y-4">
        <SkeletonSectionTitle className="w-56" />
        <SkeletonText lines={2} tone="muted" lastLineWidth="w-1/2" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <SkeletonField className="sm:flex-1" />
          <SkeletonButton className="h-10 shrink-0 sm:w-35" />
        </div>
      </section>
    ),
  }

  return (
    <main className="flex-1">
      <section className="space-y-14">
        {LANDING_SECTIONS.map((section) => (
          <Fragment key={section}>{skeletons[section]}</Fragment>
        ))}
      </section>
    </main>
  )
}

/** The opening block: the avatar, the name, the note about the work and the ways in */
function HeroSkeleton() {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-6 pb-2">
        <Skeleton tone="base" className="size-17 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton tone="strong" className="h-7 w-52" />
          <Skeleton tone="muted" className="h-3.5 w-36" />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonSectionTitle className="w-24" />
        <SkeletonText lines={3} lastLineWidth="w-3/4" />
      </div>

      <div className="space-y-2">
        <Skeleton tone="muted" className="h-3.5 w-28" />
        <div className={HERO_ROW_CLASS}>
          {['w-16', 'w-20', 'w-14', 'w-24', 'w-8'].map((width) => (
            <div key={width} className="inline-flex h-6 items-center">
              <Skeleton tone="base" className={`h-3.5 ${width}`} />
            </div>
          ))}
        </div>
        <Skeleton tone="muted" className="mt-4 h-3.5 w-64" />
      </div>

      <div className="space-y-4">
        <Skeleton tone="muted" className="h-3.5 w-48" />
        <div className={HERO_ROW_CLASS}>
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonButton key={index} className="sm:w-40" />
          ))}
        </div>
      </div>
    </section>
  )
}

/** A heading over a timeline of roles, courses or awards */
function TimelineSectionSkeleton({ titleWidth, rows }: { titleWidth: string; rows?: number }) {
  return (
    <section className="space-y-6">
      <SkeletonSectionTitle className={titleWidth} />
      <SkeletonTimelineList rows={rows} />
    </section>
  )
}

/**
 * The frame a landing page carousel sits in, with the control that leads through to its fuller
 * page. The rows are clipped and faded at both edges the way the real carousel is.
 */
function CarouselSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="relative">
        <div className="mask-fade-x relative flex flex-col gap-2 overflow-hidden py-2">
          {children}
        </div>
        <Skeleton
          tone="panel"
          className="absolute -inset-y-1 -right-2 z-10 w-8 rounded-lg ring-1 ring-inset ring-ring retina:ring-[0.5px]"
        />
      </div>
    </section>
  )
}

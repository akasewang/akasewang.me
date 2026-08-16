import { PageLayout } from '@/components/layout/page-layout'
import { SkeletonCategoryFilter } from '@/components/skeletons/shared'
import { SKILL_CHIP_WIDTHS, SkillCardSkeleton } from '@/components/skeletons/skill-card'
import { skillsPageContent } from '@/data/content/skills-content'

/** Shown while the skills grid loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={skillsPageContent.title}
      subtitle={skillsPageContent.subtitle}
      footerText={skillsPageContent.footerText}
    >
      <div className="space-y-8">
        <SkeletonCategoryFilter widths={['w-12', 'w-24', 'w-20', 'w-20']} />

        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 24 }).map((_, index) => (
            <SkillCardSkeleton
              key={index}
              width={SKILL_CHIP_WIDTHS[index % SKILL_CHIP_WIDTHS.length]}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

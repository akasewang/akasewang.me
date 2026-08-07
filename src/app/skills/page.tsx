import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { SkillsGrid } from '@/components/skills/skills-grid'
import { SITE_URL } from '@/constants/constants'
import { skillsSeoContent } from '@/data/content/seo-content'
import { skillsPageContent } from '@/data/content/skills-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: skillsSeoContent.title,
  description: skillsSeoContent.description,
  path: '/skills',
  image: getOgImageUrl(skillsSeoContent.ogTitle, 'Skills'),
  imageAlt: skillsSeoContent.imageAlt,
})

/** the skills grid */
export default function SkillsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Skills', url: `${SITE_URL}/skills` },
  ])

  return (
    <PageLayout
      title={skillsPageContent.title}
      subtitle={skillsPageContent.subtitle}
      footerText="That's the stack. No more, no less (well, maybe a little more)."
      breadcrumb={breadcrumbJsonLd}
    >
      <Suspense fallback={null}>
        <SkillsGrid />
      </Suspense>
    </PageLayout>
  )
}

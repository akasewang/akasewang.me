import { Suspense } from 'react'
import { Metadata } from 'next'
import { skillsSeoContent } from '@/data/content/seo-content'
import { skillsPageContent } from '@/data/content/skills-content'
import { SkillsGrid } from '@/components/skills/skills-grid'
import { SITE_URL } from '@/constants/constants'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { PageLayout } from '@/components/layout/page-layout'

/** Statically generated metadata for the Skills/Tech Stack page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: skillsSeoContent.title,
    description: skillsSeoContent.description,
    path: '/skills',
    image: getOgImageUrl(skillsSeoContent.ogTitle, 'Skills'),
    imageAlt: skillsSeoContent.imageAlt,
  })
}

/**
 * Main Skills Route.
 * Renders an interactive grid of technologies and skills, utilizing Suspense to
 * lazy load the grid while preserving a static skeleton layout during initial paint.
 */
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

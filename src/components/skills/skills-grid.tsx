'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { skillRows } from '@/data/static/skills'
import { SKILL_CATEGORIES } from '@/constants/categories'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { SPRING_TRANSITION } from '@/constants/ui'
import { SkillCard } from '@/components/skills/skill-card'
import type { SkillCategory } from '@/types/home'

const allSkills = [...skillRows.firstRow, ...skillRows.secondRow]

/**
 * Skills Grid Component.
 * The primary interface for the detailed skills directory.
 * Uses Framer Motion's lightweight `m` component to handle layout shifts
 * when filtering by category without bloating the bundle.
 */
export function SkillsGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const categoryParam = searchParams.get('category')

  const activeCategory = useMemo(() => {
    const isValid = categoryParam && SKILL_CATEGORIES.some((c) => c.value === categoryParam)
    return (isValid ? categoryParam : 'all') as SkillCategory
  }, [categoryParam])

  const filteredSkills = useMemo(() => {
    return activeCategory === 'all'
      ? allSkills
      : allSkills.filter((skill) => skill.category === activeCategory)
  }, [activeCategory])

  const handleCategoryChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all') {
        params.delete('category')
      } else {
        params.set('category', value)
      }

      const query = params.toString()
      const newUrl = query ? `${pathname}?${query}` : pathname

      router.replace(newUrl, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={SKILL_CATEGORIES}
        value={activeCategory}
        onChange={handleCategoryChange}
      />

      <>
        <AnimatePresence mode="popLayout">
          {filteredSkills.length > 0 ? (
            <m.div key="skills-grid" layout className="flex flex-wrap gap-2.5">
              {filteredSkills.map((skill) => (
                <m.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={SPRING_TRANSITION}
                >
                  <SkillCard skill={skill} />
                </m.div>
              ))}
            </m.div>
          ) : (
            <EmptyState key="no-skills" message="no skills found in this category." />
          )}
        </AnimatePresence>
      </>
    </div>
  )
}

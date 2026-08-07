'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useMemo } from 'react'
import { CategoryFilter } from '@/components/common/category-filter'
import { EmptyState } from '@/components/common/empty-state'
import { SkillCard } from '@/components/skills/skill-card'
import { AnimatedListItem } from '@/components/ui/animated-list-item'
import { SKILL_CATEGORIES } from '@/constants/categories'
import { skillRows } from '@/data/static/skills'
import { useCategoryParam } from '@/hooks/use-category-param'
import { usePageArriving } from '@/hooks/use-page-arrival'

const allSkills = [...skillRows.firstRow, ...skillRows.secondRow]

/** Every skill in one grid, filtered by area */
export function SkillsGrid() {
  const isArriving = usePageArriving()
  const [activeCategory, handleCategoryChange] = useCategoryParam(SKILL_CATEGORIES)

  const filteredSkills = useMemo(() => {
    return activeCategory === 'all'
      ? allSkills
      : allSkills.filter((skill) => skill.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={SKILL_CATEGORIES}
        value={activeCategory}
        onChange={handleCategoryChange}
      />

      <AnimatePresence mode="popLayout">
        {filteredSkills.length > 0 ? (
          <m.div
            key="skills-grid"
            layout={!isArriving ? 'position' : false}
            className="flex flex-wrap gap-2.5"
          >
            {filteredSkills.map((skill) => (
              <AnimatedListItem key={skill.id}>
                <SkillCard skill={skill} />
              </AnimatedListItem>
            ))}
          </m.div>
        ) : (
          <EmptyState key="no-skills" message="no skills found in this category." />
        )}
      </AnimatePresence>
    </div>
  )
}

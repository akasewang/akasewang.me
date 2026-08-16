'use client'

import { useState } from 'react'
import HomeLoading from '@/app/(home)/loading'
import AdminNewsletterLoading from '@/app/admin/newsletter/loading'
import BlogPostLoading from '@/app/blogs/[slug]/loading'
import BlogsLoading from '@/app/blogs/loading'
import CatalogLoading from '@/app/catalog/loading'
import ChangelogLoading from '@/app/changelog/loading'
import DomainsLoading from '@/app/domains/loading'
import LinksLoading from '@/app/links/loading'
import MessageBoardLoading from '@/app/message-board/loading'
import PhotosLoading from '@/app/photos/loading'
import ProjectLoading from '@/app/projects/[slug]/loading'
import ProjectsLoading from '@/app/projects/loading'
import SkillsLoading from '@/app/skills/loading'
import TestimonialsLoading from '@/app/testimonials/loading'
import UnsubscribeLoading from '@/app/unsubscribe/loading'
import { CategoryFilter } from '@/components/common/category-filter'
import { CategoryTransition } from '@/components/common/category-transition'
import { ResponsesPreview } from './responses-preview'

/**
 * Kept by hand: a new route with a loading file has to be added here too, since imports cannot be
 * globbed at build time.
 */
const SKELETONS = [
  { slug: 'home', label: 'home', Component: HomeLoading },
  { slug: 'blogs', label: 'blogs', Component: BlogsLoading },
  { slug: 'blog-post', label: 'blog post', Component: BlogPostLoading },
  { slug: 'projects', label: 'projects', Component: ProjectsLoading },
  { slug: 'project', label: 'project', Component: ProjectLoading },
  { slug: 'skills', label: 'skills', Component: SkillsLoading },
  { slug: 'catalog', label: 'catalog', Component: CatalogLoading },
  { slug: 'photos', label: 'photos', Component: PhotosLoading },
  { slug: 'testimonials', label: 'testimonials', Component: TestimonialsLoading },
  { slug: 'changelog', label: 'changelog', Component: ChangelogLoading },
  { slug: 'message-board', label: 'message board', Component: MessageBoardLoading },
  { slug: 'links', label: 'links', Component: LinksLoading },
  { slug: 'domains', label: 'domains', Component: DomainsLoading },
  { slug: 'unsubscribe', label: 'unsubscribe', Component: UnsubscribeLoading },
  { slug: 'admin-newsletter', label: 'admin newsletter', Component: AdminNewsletterLoading },
  /** Not a loading file but the real section, which has states a skeleton cannot stand in for */
  { slug: 'responses', label: 'responses', Component: ResponsesPreview },
] as const

type SkeletonSlug = (typeof SKELETONS)[number]['slug']

const CATEGORIES = SKELETONS.map(({ slug, label }) => ({ value: slug, label }))

/** The order the chips sit in, which is what tells the skeleton which way to travel */
const SKELETON_ORDER = SKELETONS.map(({ slug }) => slug)

const resolve = (slug: string | undefined) =>
  SKELETONS.find((entry) => entry.slug === slug) ?? SKELETONS[0]

/**
 * Picks which skeleton is on show.
 *
 * Held in state rather than read from the address on every pick, so choosing one swaps it in place
 * instead of loading the document again. The address is still written, without going through the
 * router, so a particular skeleton stays linkable and survives a refresh while nothing reloads.
 *
 * CategoryTransition carries the skeleton, which also keys it: each pick mounts the placeholder
 * afresh, so its pulses start together rather than picking up mid cycle from the last one. That is
 * what the plain anchor and its reload used to buy, and a skeleton half way through someone else's
 * animation is not the thing being inspected.
 */
export function SkeletonSwitcher({ initialView }: { initialView?: string }) {
  const [slug, setSlug] = useState<SkeletonSlug>(() => resolve(initialView).slug)
  const active = resolve(slug)

  const choose = (next: SkeletonSlug) => {
    setSlug(next)
    window.history.replaceState(null, '', `?view=${next}`)
  }

  return (
    <div className="space-y-8">
      <CategoryFilter categories={CATEGORIES} value={active.slug} onChange={choose} />

      <CategoryTransition value={active.slug} order={SKELETON_ORDER}>
        <active.Component />
      </CategoryTransition>
    </div>
  )
}

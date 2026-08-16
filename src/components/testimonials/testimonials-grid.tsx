'use client'

import { m } from 'framer-motion'
import { TESTIMONIAL_GRID_CLASS } from '@/components/skeletons/testimonial-card'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'
import { testimonials } from '@/data/static/testimonials'
import { useArrivedWithPage } from '@/hooks/use-page-arrival'

const allTestimonials = [...testimonials.topRow, ...testimonials.bottomRow]

/** Every testimonial in one grid, for the page rather than the carousel */
export function TestimonialsGrid() {
  const arrivedWithPage = useArrivedWithPage()

  return (
    <div className={TESTIMONIAL_GRID_CLASS}>
      {allTestimonials.map((item) => (
        <m.div
          key={item.id}
          initial={arrivedWithPage ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="h-full"
        >
          <TestimonialCard testimonial={item} />
        </m.div>
      ))}
    </div>
  )
}

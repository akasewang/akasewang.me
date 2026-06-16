'use client'

import { m } from 'framer-motion'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'
import { testimonials } from '@/data/static/testimonials'

const allTestimonials = [...testimonials.topRow, ...testimonials.bottomRow]

export function TestimonialsGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
      {allTestimonials.map((item) => (
        <m.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
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

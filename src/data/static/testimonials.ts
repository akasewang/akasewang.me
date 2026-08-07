import type { TestimonialRows } from '@/types/home'

/** Quotes from people worked with, split into two rows so each can scroll its own way */
export const testimonials: TestimonialRows = {
  topRow: [
    {
      id: 'toprow-testimonial-1',
      quote:
        "Working with him was a game changer. He seamlessly blended stunning UI design with robust backend architecture. Our website's performance skyrocketed.",
      role: 'Co-Founder & CEO, TechStart',
      url: 'https://www.linkedin.com/posts/aditi-sharma-6793b495_it-was-a-great-pleasure-to-work-with-activity-7212345678901234567-jYx1?utm_source=share&utm_medium=android_app',
      author: 'Aditi Sharma',
      verified: true,
    },
    {
      id: 'toprow-testimonial-2',
      quote:
        'He has a rare eye for design and the technical skills to back it up. Delivered a pixel perfect and highly responsive web app ahead of schedule.',
      role: 'Product Manager, Innovate Corp',
      url: 'https://www.linkedin.com/in/rohan-desai-example',
      author: 'Rohan Desai',
      verified: true,
    },
  ],
  bottomRow: [
    {
      id: 'bottomrow-testimonial-1',
      quote:
        'An exceptional developer who truly understands user experience. The interface he crafted is intuitive and the codebase is remarkably clean.',
      role: 'Lead UX Designer, CreativeFlow',
      url: 'https://www.linkedin.com/in/kavya-iyer-example',
      author: 'Kavya Iyer',
      verified: true,
    },
    {
      id: 'bottomrow-testimonial-2',
      quote:
        'His ability to translate complex requirements into elegant and high performing web solutions is outstanding. A reliable and brilliant tech partner.',
      role: 'Senior Engineering Manager, CloudScale',
      url: 'https://www.linkedin.com/in/vikram-patel-example',
      author: 'Vikram Patel',
      verified: true,
    },
  ],
}

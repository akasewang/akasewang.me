import type { TestimonialRows } from '@/types/home'

/**
 * NOTE: The following optional fields are supported by the Testimonial type
 * but are currently omitted as they are not needed for the current design:
 * role: string (e.g., 'Position, Company Name')
 * url: string (e.g., 'https://example.com/username')
 * image: string (e.g., '/testimonial-avatar/example.jpg')
 */

export const testimonials: TestimonialRows = {
  topRow: [
    {
      id: 'toprow-testimonial-1',
      quote:
        "Working with him was a game changer. He seamlessly blended stunning UI design with robust backend architecture. Our website's performance skyrocketed.",
      role: 'Co-Founder & CEO, TechStart',
      url: 'https://www.linkedin.com/posts/aditi-sharma-6793b495_it-was-a-great-pleasure-to-work-with-activity-7212345678901234567-jYx1?utm_source=share&utm_medium=android_app',
      author: 'Aditi Sharma',
    },
    {
      id: 'toprow-testimonial-2',
      quote:
        'He has a rare eye for design and the technical skills to back it up. Delivered a pixel perfect and highly responsive web app ahead of schedule.',
      role: 'Product Manager, Innovate Corp',
      url: 'https://www.linkedin.com/in/rohan-desai-example',
      author: 'Rohan Desai',
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
    },
    {
      id: 'bottomrow-testimonial-2',
      quote:
        'His ability to translate complex requirements into elegant and high-performing web solutions is outstanding. A reliable and brilliant tech partner.',
      role: 'Senior Engineering Manager, CloudScale',
      url: 'https://www.linkedin.com/in/vikram-patel-example',
      author: 'Vikram Patel',
    },
  ],
}

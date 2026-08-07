import { MarqueeField } from '@/components/common/marquee-field'

interface ProjectMediaFallbackProps {
  title: string
  className?: string
}

/** Stands in for a project's artwork where there is none, or where the file failed to load */
export function ProjectMediaFallback({ title, className }: ProjectMediaFallbackProps) {
  return (
    <MarqueeField
      text="OOPS! NO IMAGE"
      label={`${title}, no preview image`}
      className={className}
    />
  )
}

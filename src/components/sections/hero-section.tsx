'use client'

import { useRouter } from 'next/navigation'
import { PronounceMyName } from '@/components/common/pronounce-my-name'
import { SectionTitle } from '@/components/layout/section-title'
import { Button } from '@/components/ui/button'
import { Icons, VerifiedIcon } from '@/components/ui/icons'
import { LinkText } from '@/components/ui/link-text'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { TextFlip } from '@/components/ui/text-flip'
import { EMAIL, FULL_NAME } from '@/constants/constants'
import { landingPageContent } from '@/data/content/landing-content'
import { activeSocials, inactiveSocials } from '@/data/static/social'
import { renderWithLinks } from '@/utils/content-utils'

export function HeroSection() {
  const { hero } = landingPageContent
  const router = useRouter()

  return (
    <section id="hero" className="animate-page-simple space-y-8">
      <div className="flex items-center gap-6 pb-2">
        <ProfilePicture
          src="/profpic.jpg"
          alt={FULL_NAME}
          href={hero.designsUrl}
          label={hero.designsLabel}
        />

        <div className="flex flex-col">
          <h1 className="text-balance text-2xl font-semibold leading-snug tracking-tighter text-primary">
            <span className="sr-only">Software Engineer & Designer</span>
            <span className="mr-1">{hero.firstName}</span>
            <span className="inline-block">
              {hero.lastName}
              <span className="ml-2 mb-1 inline-flex items-center gap-1.5 align-middle">
                <VerifiedIcon className="size-5 text-verified" />
                <PronounceMyName namePronunciationUrl="/audios/name.wav" />
              </span>
            </span>
          </h1>

          <div className="h-6 overflow-visible" role="group" aria-label={hero.role}>
            <TextFlip className="font-mono text-sm leading-snug text-secondary">
              {hero.roles.map((role: string) => (
                <span key={role}>{role}</span>
              ))}
            </TextFlip>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>{hero.aboutTitle}</SectionTitle>
        <div className="max-w-full space-y-2 text-pretty text-sm leading-relaxed text-foreground">
          {hero.about.map((paragraph: string, i: number) => (
            <p key={i}>{renderWithLinks(paragraph)}</p>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {activeSocials.length > 0 && (
          <>
            <p className="text-sm text-foreground">{hero.findMeOn}</p>
            <div className="flex flex-wrap gap-2">
              {activeSocials.map((link) => (
                <LinkText key={link.label} href={link.href}>
                  {link.label}
                </LinkText>
              ))}
            </div>
          </>
        )}
        <p
          className={
            activeSocials.length > 0 ? 'mt-4 text-sm text-foreground' : 'text-sm text-foreground'
          }
        >
          {hero.mailMeAt} <LinkText href={`mailto:${EMAIL}`}>{EMAIL}</LinkText>
        </p>
      </div>

      {inactiveSocials.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{hero.inactivePrefix}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {inactiveSocials.map((link) => (
              <LinkText
                key={link.label}
                href={link.href}
                className="text-muted-foreground supports-hover:hover:text-muted-foreground active:text-muted-foreground"
              >
                {link.label}
              </LinkText>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-foreground">{hero.connectText}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Button
            defaultText={hero.scheduleMeet}
            defaultIcon={Icons.calendar}
            onClick={() => window.open(hero.scheduleMeetUrl, '_blank', 'noopener,noreferrer')}
          />
          <Button
            variant="minimal"
            defaultText={hero.messageBoard}
            defaultIcon={Icons.messageBoard}
            onClick={() => router.push('/message-board')}
          />
        </div>
      </div>
    </section>
  )
}

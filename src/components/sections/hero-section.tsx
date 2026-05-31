"use client";

import Image from "next/image";
import { LinkText } from "@/components/ui/link-text";
import { Icons, VerifiedIcon } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { PronounceMyName } from "@/components/common/pronounce-my-name";
import { renderWithLinks } from "@/utils/content-utils";
import { landingPageContent } from "@/data/content/landing-content";
import { activeSocials, inactiveSocials } from "@/data/static/social";
import { FULL_NAME, EMAIL } from "@/constants/constants";
import { TextFlip } from "@/components/ui/text-flip";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/layout/section-title";

/**
 * Hero Section Component.
 * The primary introduction area on the landing page. Renders the user's avatar, name,
 * rotating roles (via TextFlip), and active/inactive social links.
 * Includes the PronounceMyName audio trigger and integrates content from static data models.
 */
export function HeroSection() {
  const { hero } = landingPageContent;
  const router = useRouter();

  return (
    <section id="hero" className="animate-page-simple space-y-8">
      <div className="flex items-center gap-4 pb-2">
        <Image
          src="/profpic.png"
          alt={FULL_NAME}
          width={64}
          height={64}
          priority
          className="shrink-0 rounded-full transition duration-300"
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

          <div className="h-6 overflow-visible" aria-label={hero.role}>
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
        <p className="text-sm text-foreground">{hero.findMeOn}</p>
        <div className="flex flex-wrap gap-2">
          {activeSocials.map((link) => (
            <LinkText key={link.label} href={link.href}>
              {link.label}
            </LinkText>
          ))}
        </div>
        <p className="mt-4 text-sm text-foreground">
          {hero.mailMeAt} <LinkText href={`mailto:${EMAIL}`}>{EMAIL}</LinkText>
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{hero.inactivePrefix}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {inactiveSocials.map((link) => (
            <LinkText
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-muted-foreground"
            >
              {link.label}
            </LinkText>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-foreground">{hero.connectText}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Button
            defaultText={hero.scheduleMeet}
            defaultIcon={Icons.calendar}
            onClick={() => window.open(hero.scheduleMeetUrl, "_blank")}
          />
          <Button
            variant="minimal"
            defaultText={hero.messageBoard}
            defaultIcon={Icons.messageBoard}
            onClick={() => router.push("/message-board")}
          />
        </div>
      </div>
    </section>
  );
}

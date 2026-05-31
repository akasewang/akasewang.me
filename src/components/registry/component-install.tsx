'use client'

import { SITE_URL } from '@/constants/constants'
import { Tabs, Tab } from '@/components/common/mdx-components/tabs'
import { Pre } from '@/components/common/mdx-components/code-block'

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const

const PREFIX_MAP: Record<(typeof PACKAGE_MANAGERS)[number], string> = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'npx',
  bun: 'bunx --bun',
}

interface ComponentInstallProps {
  slug: string
}

/**
 * Renders a tabbed interface for generating Shadcn CLI installation commands.
 * Automatically generates the correct command syntax for various package managers
 * (npm, pnpm, yarn, bun) using the component's unique registry URL.
 *
 * @param slug - The unique identifier of the component in the registry.
 */

export function ComponentInstall({ slug }: ComponentInstallProps) {
  return (
    <div className="my-8 w-full not-prose">
      <Tabs items={PACKAGE_MANAGERS as unknown as string[]}>
        {PACKAGE_MANAGERS.map((pm) => (
          <Tab key={pm} title={pm}>
            <Pre copyable className="text-zinc-50">
              <code>{`${PREFIX_MAP[pm]} shadcn@latest add ${SITE_URL}/r/${slug}.json`}</code>
            </Pre>
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}

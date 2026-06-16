import { NextResponse } from 'next/server'
import { fetchGithub, GITHUB_REPO_URL } from '@/lib/github'

export const revalidate = 3600

export async function GET() {
  try {
    const response = await fetchGithub(GITHUB_REPO_URL)

    if (!response.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: 502 })
    }

    const data = await response.json()
    const count = data.stargazers_count

    if (typeof count !== 'number') {
      return NextResponse.json({ error: 'Malformed GitHub response' }, { status: 502 })
    }

    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: 'GitHub API unreachable' }, { status: 502 })
  }
}

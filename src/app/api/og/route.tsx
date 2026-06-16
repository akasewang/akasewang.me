import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/constants/constants'

export const runtime = 'edge'

async function loadGoogleFont(family: string, weight: number, text: string, italic = false) {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+',
  )}:${axis}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36',
    },
  })

  if (!cssResponse.ok) throw new Error(`Could not load ${family} CSS`)

  const css = await cssResponse.text()
  const src = css.match(/src: url\((.+?)\) format\('(woff2|opentype|truetype)'\)/)
  if (!src?.[1]) throw new Error(`Could not load ${family} ${weight}`)

  const fontResponse = await fetch(src[1])
  if (!fontResponse.ok) throw new Error(`Could not load ${family} font file`)

  return fontResponse.arrayBuffer()
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has('title')

    const title = hasTitle
      ? (searchParams.get('title')?.trim().slice(0, 100) ?? '')
      : 'My work is better than this tagline.'

    const type = searchParams.get('type')?.trim().slice(0, 50)
    const domain = new URL(SITE_URL).host
    const eyebrow = (type ? `${domain} / ${type}` : domain).toLowerCase()

    const [ptSerif, interReg] = await Promise.all([
      loadGoogleFont('PT Serif', 400, title, true),
      loadGoogleFont('Inter', 400, eyebrow),
    ])

    return new ImageResponse(
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#0a0a0a',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='7.5' cy='7.5' r='0.75' fill='%23333333'/%3E%3C/svg%3E")`,
          padding: '88px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'radial-gradient(ellipse 70% 60% at 30% 50%, transparent 0%, #0a0a0a 100%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'PT Serif',
                fontStyle: 'italic',
                fontSize: hasTitle ? 84 : 76,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#ffffff',
                maxWidth: '860px',
                textWrap: 'balance',
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 400,
              letterSpacing: '0.08em',
            }}
          >
            {type ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#737373' }}>{domain.toLowerCase()}</span>
                <span style={{ color: '#404040', margin: '0 12px' }}>/</span>
                <span style={{ color: '#d4d4d4' }}>{type.toLowerCase()}</span>
              </div>
            ) : (
              <span style={{ color: '#737373' }}>{domain.toLowerCase()}</span>
            )}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'PT Serif', data: ptSerif, weight: 400, style: 'italic' },
          { name: 'Inter', data: interReg, weight: 400, style: 'normal' },
        ],
      },
    )
  } catch {
    return new Response('Failed to generate image', { status: 500 })
  }
}

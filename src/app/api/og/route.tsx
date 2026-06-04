import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/constants/constants'

/** Force the route to use the Edge runtime to ensure ultra-low latency globally */
export const runtime = 'edge'

/**
 * Fetches a specific Google Font subset directly from the Google Fonts API.
 * This is required for Next.js OG generation on the Edge, as local files are inaccessible.
 *
 * @param family - The font family name.
 * @param weight - The numeric font weight.
 * @param text - The specific string of text to subset the font for (reduces payload size).
 * @param italic - Whether to fetch the italic variant.
 * @returns An ArrayBuffer of the font file.
 */
async function loadGoogleFont(family: string, weight: number, text: string, italic = false) {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+',
  )}:${axis}&text=${encodeURIComponent(text)}`

  const css = await (
    await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36',
      },
    })
  ).text()

  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!src?.[1]) throw new Error(`Could not load ${family} ${weight}`)
  return (await fetch(src[1])).arrayBuffer()
}

/** SVG path for the brand monogram drawn as a faint watermark behind the OG card. */
const MARK_PATH =
  'm 7.8293982,18.547094 c -0.2832514,-0.936816 -1.8081924,-0.975988 -3.8588893,1.436597 -0.3626676,0.39289 -0.6648907,0.816002 -0.9066692,1.269338 -0.211556,0.453334 -0.3626676,0.876447 -0.4533346,1.269336 -0.060444,0.362668 -0.030222,0.664891 0.090667,0.906669 0.1208892,0.24178 0.3324454,0.362667 0.6346684,0.362667 0.4231123,0 0.8613357,-0.226667 1.3146703,-0.680001 C 5.1038456,22.628144 5.5269579,22.084143 5.9198479,21.479696 6.34296,20.875249 6.73585,20.285915 7.0985178,19.711689 7.4872653,19.082613 7.8038346,18.674184 7.8138812,18.63826 c -2.3505635,7.154207 3.8813858,4.282557 5.9877058,1.753432 0.39289,-0.53898 0.673122,-0.935321 1.050899,-1.282877 2.548959,-2.345048 3.916665,-0.149716 3.981143,1.010884 -0.328093,-2.479043 -2.530989,-2.54984 -3.978014,-1.008671 -0.702744,0.748464 -1.386447,1.749116 -1.96067,3.139343 -0.302223,0.695113 -0.39289,1.284447 -0.272001,1.768004 0.151113,0.483556 0.438223,0.725336 0.861337,0.725336 0.423112,0 0.982225,-0.24178 1.677337,-0.725336 0.695114,-0.513779 1.465782,-1.178668 2.312007,-1.994671 0.876447,-0.846225 1.798227,-1.828452 2.765342,-2.946675 0.967114,-1.118227 1.904004,-2.296896 2.810674,-3.536011 0.936891,-1.239115 1.813338,-2.493342 2.629341,-3.762676 0.816,-1.299558 1.526224,-2.5537846 2.130671,-3.7626768 0.846224,-1.6320045 1.360004,-2.9466748 1.541337,-3.9440111 0.181334,-1.0275584 0,-1.5413376 -0.544001,-1.5413376 -0.604446,0 -1.344893,0.6648908 -2.22134,1.9946723 -0.876447,1.2995592 -1.858671,3.2337866 -2.946674,5.8026832 -0.241777,0.574223 -0.619556,1.435557 -1.133337,2.584005 -0.483556,1.14845 -1.012447,2.432896 -1.586671,3.853344 -0.574223,1.390227 -1.133337,2.840897 -1.677337,4.352012 -0.513781,1.480894 -0.921781,2.856008 -1.224004,4.125346 -0.302223,1.269336 -0.453334,2.34223 -0.453334,3.218676 0.03022,0.846224 0.302225,1.344892 0.816001,1.496005'

/**
 * Dynamic Open Graph (OG) image generation route.
 * Renders a customized, branded social card using the Edge runtime for instant delivery.
 * Parses query parameters to dynamically generate titles and breadcrumbs.
 * @param request - The incoming HTTP request with query parameters.
 * @returns An ImageResponse containing the generated PNG.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has('title')
    /** Truncate titles to 100 characters to prevent layout breakage in the generated image */
    const title = hasTitle
      ? (searchParams.get('title')?.slice(0, 100) ?? '')
      : 'Software engineer who designs on the side.'

    /** Derive the breadcrumb UI (e.g. "domain.com / projects") based on the type parameter */
    const type = searchParams.get('type')
    const domain = SITE_URL.replace(/^https?:\/\//, '')
    const eyebrow = (type ? `${domain} / ${type}` : domain).toLowerCase()

    /** Fetch fonts in parallel, strictly subsetted to the text that will be rendered */
    const [ptSerif, interReg] = await Promise.all([
      loadGoogleFont('PT Serif', 400, title, true),
      loadGoogleFont('Inter', 400, eyebrow),
    ])

    /** Construct the JSX tree that Next.js OG (Satori) will compile into an SVG and then PNG */
    return new ImageResponse(
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '88px',
          fontFamily: 'Inter',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-120px',
            bottom: '-160px',
            display: 'flex',
            filter: 'blur(8px)',
          }}
        >
          <svg width="640" height="640" viewBox="0 0 32 32" fill="none">
            <path
              d={MARK_PATH}
              stroke="#1a1a1a"
              strokeWidth="0.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 21,
              fontWeight: 400,
              color: '#737373',
              letterSpacing: '0.04em',
              marginBottom: '28px',
            }}
          >
            {type ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#a3a3a3' }}>{domain.toLowerCase()}</span>
                <span style={{ color: '#525252', margin: '0 11px' }}>/</span>
                <span>{type.toLowerCase()}</span>
              </div>
            ) : (
              domain.toLowerCase()
            )}
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'PT Serif',
              fontStyle: 'italic',
              fontSize: hasTitle ? 80 : 76,
              fontWeight: 400,
              letterSpacing: '-0.015em',
              lineHeight: 1.14,
              color: '#fafafa',
              maxWidth: '860px',
            }}
          >
            {title}
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
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 })
  }
}

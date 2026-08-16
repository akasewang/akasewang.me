import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Next's own presets, plus one rule of this project's own. Formatting and the rest of the linting
 * are Biome's job, so nothing here overlaps with what that already covers.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      /** An async function that never awaits is usually a server action missing its await */
      'require-await': 'error',
    },
  },
]

export default eslintConfig

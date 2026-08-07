/** Messages the server logs, kept together so their wording stays consistent */
export const logContent = {
  view: {
    incrementError: 'Error incrementing view (likely offline)',
    batchFetchError: 'Error fetching batch views (likely offline)',
  },
  newsletter: {
    broadcastError: 'Broadcast error',
  },
  subscribe: {
    error: 'Error in subscribe action',
  },
} as const

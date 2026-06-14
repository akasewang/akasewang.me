'use client'

import { createContext, useContext } from 'react'

/**
 * True while MDX is rendered inside a tab panel. Nested code blocks read this to drop their
 * file type tab and lift shadow, rendering as a plain surface within the tab container.
 */
export const TabPanelContext = createContext(false)

/** Whether the current MDX subtree is rendered inside a tab panel. */
export const useInTabPanel = () => useContext(TabPanelContext)

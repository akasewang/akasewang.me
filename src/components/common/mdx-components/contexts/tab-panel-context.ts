'use client'

import { createContext, useContext } from 'react'

/**
 * Whether the surrounding content is inside a tab panel, which the blocks that would otherwise draw
 * their own frame ask before doing so, since the panel is already one.
 */
export const TabPanelContext = createContext(false)

export const useInTabPanel = () => useContext(TabPanelContext)

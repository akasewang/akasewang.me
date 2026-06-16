'use client'

import { createContext, useContext } from 'react'

export const TabPanelContext = createContext(false)

export const useInTabPanel = () => useContext(TabPanelContext)

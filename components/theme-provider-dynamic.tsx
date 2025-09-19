'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Create a dynamic ThemeProvider that only renders on the client
const DynamicThemeProvider = dynamic(
  () => Promise.resolve(NextThemesProvider),
  {
    ssr: false,
  }
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <DynamicThemeProvider {...props}>{children}</DynamicThemeProvider>
}

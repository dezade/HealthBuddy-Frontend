'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use a more robust approach to handle hydration
  return (
    <NextThemesProvider 
      {...props}
      // Add storageKey to ensure consistent storage
      storageKey="healthbuddy-theme"
      // Force a re-render on the client side
      enableSystem={true}
      // Suppress hydration warnings for theme-related mismatches
      value={{
        light: "light",
        dark: "dark",
        system: "system",
      }}
    >
      {children}
    </NextThemesProvider>
  )
}

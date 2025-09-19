"use client"

import { Button } from "@/components/ui/button"
import { Heart, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LandingTopbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            HealthBuddy
          </span>
        </Link>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/signin">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="container py-4 space-y-3">
              <Link href="/signin" onClick={toggleMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup" onClick={toggleMenu}>
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

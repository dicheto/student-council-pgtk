'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show button only if scrolled more than 500px
      if (currentScrollY > 500) {
        // Check scroll direction
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide button
          setIsScrollingDown(true)
          setIsVisible(false)
        } else {
          // Scrolling up - show button
          setIsScrollingDown(false)
          setIsVisible(true)
        }
      } else {
        setIsVisible(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group"
          aria-label="Scroll to top"
        >
          {/* Glassmorphism Container */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16">
            {/* Main glass layer */}
            <div className="absolute inset-0 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary-light/20" />
              
              {/* Subtle top highlight */}
              <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/20 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

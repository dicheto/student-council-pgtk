'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left relative overflow-hidden"
      style={{ scaleX }}
    >
      {/* Main gradient progress bar */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light via-accent to-primary-light"
        style={{ 
          backgroundSize: '200% 100%',
          width: '100%',
        }}
        animate={{ backgroundPosition: ['0% center', '200% center'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-light via-accent to-primary-light opacity-50 blur-sm"
        style={{ 
          backgroundSize: '200% 100%',
          width: '100%',
        }}
        animate={{ backgroundPosition: ['200% center', '0% center'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

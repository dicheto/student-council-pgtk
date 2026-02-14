'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface AnimatedLogoProps {
  size?: number
  className?: string
  animated?: boolean
  transparent?: boolean
  rotating?: boolean
  showText?: boolean
  logoUrl?: string | null
}

export function AnimatedLogo({ 
  size = 80, 
  className = '',
  animated = true,
  transparent = false,
  rotating = false,
  showText = false,
  logoUrl = null
}: AnimatedLogoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // If custom logo URL is provided, show image immediately
  if (logoUrl) {
    return (
      <div 
        className={className}
        style={{ 
          width: size, 
          height: size, 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={size}
          height={size}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  const centerX = size / 2
  const centerY = size / 2
  const outerRadius = size * 0.42
  const innerRadius = size * 0.25

  // Gradient definitions for unique look
  const gradientId = `logoGradient_${Math.random().toString(36).substr(2, 9)}`
  const glowId = `logoGlow_${Math.random().toString(36).substr(2, 9)}`

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: transparent ? 0.2 : 1,
      transition: {
        pathLength: {
          delay: animated ? i * 0.2 : 0,
          duration: animated ? 1.5 : 0.5,
          ease: 'easeInOut',
        },
        opacity: {
          delay: animated ? i * 0.2 : 0,
          duration: 0.5,
        },
      },
    }),
  }

  const letterVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: transparent ? 0.3 : 1,
      transition: {
        delay: animated ? 0.6 : 0,
        duration: animated ? 0.8 : 0.3,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const containerVariants = {
    visible: {
      rotate: rotating ? 360 : 0,
      transition: {
        rotate: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    },
  }

  // Letters for ПГТК
  const letters = ['П', 'Г', 'Т', 'К']
  const letterPositions = [
    { x: centerX - size * 0.18, y: centerY - size * 0.05 },
    { x: centerX + size * 0.02, y: centerY - size * 0.05 },
    { x: centerX - size * 0.18, y: centerY + size * 0.15 },
    { x: centerX + size * 0.02, y: centerY + size * 0.15 },
  ]

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      variants={rotating ? containerVariants : undefined}
      animate={rotating ? 'visible' : undefined}
      initial="hidden"
    >
      <defs>
        {/* Gradient for circles */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={transparent ? 'currentColor' : '#0047AB'} />
          <stop offset="50%" stopColor={transparent ? 'currentColor' : '#87CEEB'} />
          <stop offset="100%" stopColor={transparent ? 'currentColor' : '#0047AB'} />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer decorative ring with dashes */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={outerRadius}
        fill="none"
        stroke={transparent ? 'currentColor' : `url(#${gradientId})`}
        strokeWidth={transparent ? 1 : 3}
        strokeOpacity={transparent ? 0.15 : 0.8}
        strokeDasharray={`${size * 0.08} ${size * 0.04}`}
        variants={circleVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      />

      {/* Middle ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={outerRadius * 0.85}
        fill="none"
        stroke={transparent ? 'currentColor' : '#0047AB'}
        strokeWidth={transparent ? 1 : 2}
        strokeOpacity={transparent ? 0.2 : 0.6}
        variants={circleVariants}
        custom={1}
        initial="hidden"
        animate="visible"
      />

      {/* Inner circle - main border */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={innerRadius}
        fill={transparent ? 'none' : 'rgba(0, 71, 171, 0.1)'}
        stroke={transparent ? 'currentColor' : `url(#${gradientId})`}
        strokeWidth={transparent ? 2 : 3}
        strokeOpacity={transparent ? 0.25 : 1}
        filter={transparent ? undefined : `url(#${glowId})`}
        variants={circleVariants}
        custom={2}
        initial="hidden"
        animate="visible"
      />

      {/* Decorative arcs */}
      {!transparent && (
        <>
          <motion.path
            d={`M ${centerX - outerRadius * 0.6} ${centerY - outerRadius * 0.6} 
               A ${outerRadius * 0.85} ${outerRadius * 0.85} 0 0 1 ${centerX + outerRadius * 0.6} ${centerY - outerRadius * 0.6}`}
            fill="none"
            stroke="#87CEEB"
            strokeWidth={2}
            strokeLinecap="round"
            variants={circleVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d={`M ${centerX + outerRadius * 0.6} ${centerY + outerRadius * 0.6} 
               A ${outerRadius * 0.85} ${outerRadius * 0.85} 0 0 1 ${centerX - outerRadius * 0.6} ${centerY + outerRadius * 0.6}`}
            fill="none"
            stroke="#87CEEB"
            strokeWidth={2}
            strokeLinecap="round"
            variants={circleVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          />
        </>
      )}

      {/* Small decorative dots */}
      {!transparent && [0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = centerX + Math.cos(rad) * outerRadius * 0.92
        const y = centerY + Math.sin(rad) * outerRadius * 0.92
        return (
          <motion.circle
            key={angle}
            cx={x}
            cy={y}
            r={size * 0.02}
            fill="#F59E0B"
            variants={circleVariants}
            custom={i + 4}
            initial="hidden"
            animate="visible"
          />
        )
      })}

      {/* Center content - УС letters or ПГТК grid */}
      <motion.g 
        variants={letterVariants} 
        initial="hidden" 
        animate="visible"
        filter={transparent ? undefined : `url(#${glowId})`}
      >
        {showText ? (
          // ПГТК in 2x2 grid
          letters.map((letter, i) => (
            <motion.text
              key={letter}
              x={letterPositions[i].x}
              y={letterPositions[i].y}
              fontSize={size * 0.14}
              fontWeight="bold"
              fontFamily="var(--font-display), system-ui, sans-serif"
              fill={transparent ? 'currentColor' : '#0047AB'}
              fillOpacity={transparent ? 0.3 : 1}
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: transparent ? 0.3 : 1, scale: 1 }}
              transition={{ delay: animated ? 0.8 + i * 0.1 : 0, duration: 0.3 }}
            >
              {letter}
            </motion.text>
          ))
        ) : (
          // УС letters stacked
          <>
            <motion.text
              x={centerX}
              y={centerY - size * 0.02}
              fontSize={size * 0.18}
              fontWeight="bold"
              fontFamily="var(--font-display), system-ui, sans-serif"
              fill={transparent ? 'currentColor' : '#0047AB'}
              fillOpacity={transparent ? 0.3 : 1}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              УС
            </motion.text>
            {!transparent && (
              <motion.text
                x={centerX}
                y={centerY + size * 0.12}
                fontSize={size * 0.06}
                fontWeight="600"
                fontFamily="var(--font-sans), system-ui, sans-serif"
                fill="#87CEEB"
                textAnchor="middle"
                dominantBaseline="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animated ? 1 : 0 }}
              >
                ПГТК
              </motion.text>
            )}
          </>
        )}
      </motion.g>

      {/* Animated sparkle effect */}
      {!transparent && animated && (
        <motion.circle
          cx={centerX + outerRadius * 0.3}
          cy={centerY - outerRadius * 0.3}
          r={size * 0.015}
          fill="#F59E0B"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.svg>
  )
}

// Separate component for full brand logo with text
export function BrandLogo({ 
  size = 40, 
  showFullName = false,
  className = '',
  logoUrl,
  siteName,
  schoolName
}: { 
  size?: number
  showFullName?: boolean
  className?: string
  logoUrl?: string | null
  siteName?: string
  schoolName?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AnimatedLogo size={size} animated={true} logoUrl={logoUrl} />
      <div className="flex flex-col">
        <span className="font-display font-bold text-primary dark:text-primary-light leading-tight">
          {siteName || 'Ученически Съвет'}
        </span>
        {showFullName && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ПГТК
          </span>
        )}
      </div>
    </div>
  )
}

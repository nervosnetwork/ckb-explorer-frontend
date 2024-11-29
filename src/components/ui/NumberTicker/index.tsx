import { useEffect, useRef, useState } from 'react'

interface NumberTickerProps {
  value: number | null
  duration?: number // duration in milliseconds
  className?: string
}

export function NumberTicker({
  value,
  duration = 1000, // default animation duration: 1 second
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValueRef = useRef(value ?? 0) // Store the previous value
  const animationFrame = useRef<number>()

  useEffect(() => {
    if (typeof value !== 'number') {
      return
    }
    const startValue = prevValueRef.current // Previous value
    const targetValue = value // New value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1) // Progress between 0 and 1

      // Calculate interpolated value
      const interpolatedValue = Math.floor(startValue + (targetValue - startValue) * progress)
      setDisplayValue(interpolatedValue)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    animationFrame.current = requestAnimationFrame(animate)

    // Update the previous value reference
    prevValueRef.current = value

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [value, duration])

  return <span className={className}>{displayValue?.toLocaleString('en') ?? '--,---,---'}</span>
}

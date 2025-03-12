import { getPrimaryColor } from '../constants/common'

/* eslint-disable no-bitwise */
export const uniqueColor = (key: string): string => {
  if (key === 'ckb') return getPrimaryColor()
  // Convert string to hash number
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert hash to HSL
  const h = Math.abs(hash % 360) // Hue: 0-360
  const s = 85 + Math.abs(hash % 15) // Saturation: 85-100%
  const l = 60 + Math.abs(hash % 15) // Lightness: 60-75%

  return `hsl(${h}, ${s}%, ${l}%)`
}

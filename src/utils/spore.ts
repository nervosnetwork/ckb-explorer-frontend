import { toBigEndian } from '@nervosnetwork/ckb-sdk-utils'
import { hexToUtf8 } from './string'
import { hexToBase64 } from './util'

// parse spore cluster data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeClusterData(hexData: string) {
  const data = hexData.replace(/^0x/g, '')

  const nameOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2
  const descriptionOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2

  const name = hexToUtf8(`0x${data.slice(nameOffset + 8, descriptionOffset)}`)
  const description = hexToUtf8(`0x${data.slice(descriptionOffset + 8)}`)
  try {
    const parsed = JSON.parse(description)
    if (typeof parsed === 'object') {
      const v: Record<string, string> = { name }
      Object.keys(parsed).forEach(key => {
        if (key === 'name') {
          throw new Error('name key is reserved')
        }
        v[key] = JSON.stringify(parsed[key], null, 2)
      })
      return v
    }
  } catch {
    // ignore
  }
  return { name, description }
}

// parse spore cell data guideline: https://github.com/sporeprotocol/spore-sdk/blob/beta/docs/recipes/handle-cell-data.md
export function parseSporeCellData(hexData: string) {
  const data = hexData.replace(/^0x/g, '')

  const contentTypeOffset = Number(toBigEndian(`0x${data.slice(8, 16)}`)) * 2
  const contentOffset = Number(toBigEndian(`0x${data.slice(16, 24)}`)) * 2
  const clusterIdOffset = Number(toBigEndian(`0x${data.slice(24, 32)}`)) * 2

  const contentType = hexToUtf8(`0x${data.slice(contentTypeOffset + 8, contentOffset)}`)
  const content = data.slice(contentOffset + 8, clusterIdOffset)
  const clusterId = `0x${data.slice(clusterIdOffset + 8)}`

  if (clusterId !== '0x') {
    return { contentType, content, clusterId }
  }

  return { contentType, content }
}

export const getImgFromSporeCell = (hexData: string) => {
  const DEFAULT_URL = '/images/spore_placeholder.svg'
  const { contentType, content } = parseSporeCellData(hexData)
  if (contentType.startsWith('image')) {
    const base64Data = hexToBase64(content)
    return `data:${contentType};base64,${base64Data}`
  }
  if (contentType === 'application/json') {
    try {
      const raw: any = JSON.parse(hexToUtf8(`0x${content}`))
      if (raw?.resource?.type?.startsWith('image')) {
        return raw.resource?.url ?? DEFAULT_URL
      }
    } catch {
      return DEFAULT_URL
    }
  }
  return DEFAULT_URL
}

export const isDob0 = (item: { standard: string | null; cell: { data: string | null } | null }) => {
  if (item.standard !== 'spore') return false
  if (!item.cell?.data) return false
  try {
    const parsed = parseSporeCellData(item.cell.data)
    return parsed.contentType === 'dob/0'
  } catch {
    // ignore
  }
  return false
}

import { toBigEndian } from '@nervosnetwork/ckb-sdk-utils'
// eslint-disable-next-line import/no-extraneous-dependencies
import { config, renderByTokenKey, svgToBase64 } from '@nervape/dob-render'
import { hexToUtf8 } from './string'
import { hexToBase64 } from './util'
import { isMainnet } from './chain'

let isConfiguredDobDecoder = false

export const setupDobConfig = () => {
  if (isConfiguredDobDecoder) return
  config.setDobDecodeServerURL(isMainnet() ? 'https://dob-decoder.rgbpp.io' : 'https://dob0-decoder-dev.omiga.io')

  config.setQueryBtcFsFn(async (uri: string) => {
    const url = isMainnet()
      ? `https://api.omiga.io/api/v1/nfts/dob_imgs?uri=${uri}`
      : `https://test-api.omiga.io/api/v1/nfts/dob_imgs?uri=${uri}`
    const response = await fetch(url)
    return response.json()
  })

  isConfiguredDobDecoder = true
}

setupDobConfig()

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

/*
 * data: cell data
 * id: cell.type_script.args
 */
export const getSporeImg = async ({ data: hexData, id: sporeId }: { data: string; id: string }): Promise<string> => {
  const DEFAULT_URL = '/images/spore_placeholder.svg'
  if (!hexData && !sporeId) {
    return DEFAULT_URL
  }

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
  if (contentType === 'application/ckbfs') {
    try {
      // content is hex-encoded "ckbfs://0x<typeId>" string
      const ckbfsUri = hexToUtf8(`0x${content}`)
      const typeId = ckbfsUri.replace(/^ckbfs:\/\//, '')
      const img = await resolveCKBFSImage(typeId)
      if (img) return img
    } catch {
      // fall through to placeholder
    }
  }
  if (contentType.startsWith('dob/')) {
    const renderRes = await renderByTokenKey(sporeId.slice(2))
    const base64Img = await svgToBase64(renderRes)
    return base64Img
  }
  return DEFAULT_URL
}

/**
 * Resolve a CKBFS TypeID to a base64 data URL for inline image display.
 * Fetches the CKBFS index cell, then reassembles file bytes from witnesses.
 * Supports multi-chunk files (Vec<Uint32> indexes in cell data).
 */
async function resolveCKBFSImage(typeId: string): Promise<string | null> {
  const CKBFS_CODE_HASH = '0x31e6376287d223b8c0410d562fb422f04d1d617b2947596a14c3d2efb7218d3a'
  const rpcUrl = isMainnet() ? 'https://mainnet.ckbapp.dev' : 'https://testnet.ckbapp.dev'

  const rpc = async (method: string, params: unknown[]) => {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.result
  }

  // Find live CKBFS index cell
  const cellsResult = await rpc('get_cells', [
    { script: { code_hash: CKBFS_CODE_HASH, hash_type: 'data1', args: typeId }, script_type: 'type', filter: null },
    'asc',
    '0x1',
  ])
  const cells = cellsResult?.objects ?? []
  if (!cells.length) return null

  const cell = cells[0]
  const meta = decodeCKBFSData(cell.output_data ?? '0x')
  if (!meta.contentType.startsWith('image/')) return null

  // Fetch publish transaction
  const txResult = await rpc('get_transaction', [cell.out_point.tx_hash])
  const witnesses: string[] = txResult?.transaction?.witnesses ?? []

  // Reassemble all chunks (multi-chunk support)
  const chunks: Uint8Array[] = []
  for (const idx of meta.indexes) {
    if (idx >= witnesses.length) return null
    const chunk = extractCKBFSChunk(witnesses[idx])
    if (!chunk) return null
    chunks.push(chunk)
  }

  const totalLen = chunks.reduce((s, c) => s + c.length, 0)
  const fileBytes = new Uint8Array(new ArrayBuffer(totalLen))
  let offset = 0
  for (const chunk of chunks) { fileBytes.set(chunk, offset); offset += chunk.length }

  // Convert to base64 data URL
  let binary = ''
  for (let i = 0; i < fileBytes.length; i++) binary += String.fromCharCode(fileBytes[i])
  return `data:${meta.contentType};base64,${btoa(binary)}`
}

interface CKBFSMeta {
  indexes: number[]
  contentType: string
  filename: string
}

function decodeCKBFSData(hex: string): CKBFSMeta {
  const raw = hexBytes(hex)
  const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength)
  const dv = new DataView(buf)

  const firstOffset = dv.getUint32(4, true)
  const fieldCount = firstOffset / 4 - 1
  const offsets: number[] = []
  for (let i = 0; i < fieldCount; i++) offsets.push(dv.getUint32(4 + i * 4, true))
  offsets.push(dv.getUint32(0, true))

  const readStr = (off: number) => {
    const len = dv.getUint32(off, true)
    return new TextDecoder().decode(new Uint8Array(buf, off + 4, len))
  }

  if (fieldCount === 4) {
    // index: Uint32, checksum: Uint32, content_type: Bytes, filename: Bytes
    return { indexes: [dv.getUint32(offsets[0], true)], contentType: readStr(offsets[2]), filename: readStr(offsets[3]) }
  }
  // indexes: Vec<Uint32>, checksum: Uint32, content_type: Bytes, filename: Bytes, backlinks
  const idxBuf = buf.slice(offsets[0], offsets[1])
  const idxDv = new DataView(idxBuf)
  const count = idxDv.getUint32(0, true)
  const indexes: number[] = []
  for (let i = 0; i < count; i++) indexes.push(idxDv.getUint32(4 + i * 4, true))
  return { indexes, contentType: readStr(offsets[2]), filename: readStr(offsets[3]) }
}

function extractCKBFSChunk(witnessHex: string): Uint8Array | null {
  const bytes = hexBytes(witnessHex)
  const magic = new TextDecoder().decode(bytes.slice(0, 5))
  if (magic !== 'CKBFS') return null
  const version = bytes[5]
  return bytes.slice(version === 0x03 ? 50 : 6)
}

function hexBytes(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex
  const buf = new ArrayBuffer(h.length / 2)
  const b = new Uint8Array(buf)
  for (let i = 0; i < b.length; i++) b[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16)
  return b
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

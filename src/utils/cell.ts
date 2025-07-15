import type { Cell, Script } from '@ckb-lumos/base'
import { ckbHash } from '@ckb-lumos/base/lib/utils'
import { minimalCellCapacityCompatible } from '@ckb-lumos/helpers'
import { blockchain } from '@ckb-lumos/base'
import { BI } from '@ckb-lumos/bi'
import { IS_MAINNET } from '../constants/common'
import { MainnetContractHashTags, TestnetContractHashTags, scripts } from '../constants/scripts'

const DEPOSIT_DAO_DATA = '0x0000000000000000'

export const UDT_CELL_TYPES = ['udt', 'sudt', 'xudt', 'omiga_inscription', 'xudt_compatible']
export const LOCK_CELL_TYPES = ['Fiber Channel']

export function getCellType(cell: Cell): { type: string; info?: Record<string, string> } {
  const scriptSet = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags

  // primary type
  // 1. fiber
  // 2. deployment
  const matchedLockScript = scriptSet
    .filter(s => s.category === 'lock' && LOCK_CELL_TYPES.includes(s.tag))
    .find(s => s.codeHashes.includes(cell.cellOutput.lock.codeHash))

  if (matchedLockScript) {
    const scriptInfo = scripts.get(matchedLockScript.tag)
    return { type: scriptInfo?.name ?? matchedLockScript.tag }
  }

  const outPoint = cell.outPoint ? `${cell.outPoint.txHash}-${+cell.outPoint.index}` : null

  if (outPoint) {
    const matchedDeployment = scriptSet.find(s => s.txHashes.includes(outPoint))
    if (matchedDeployment) {
      const scriptInfo = scripts.get(matchedDeployment.tag)
      return {
        type: 'deployment',
        info: {
          tag: scriptInfo?.name ?? matchedDeployment.tag,
        },
      }
    }
  }

  const cellTypeScript = cell.cellOutput.type

  if (!cellTypeScript) {
    return { type: 'normal' }
  }

  const matchedScript = scriptSet.find(script =>
    script.codeHashes.find(codeHash => codeHash === cellTypeScript.codeHash),
  )

  if (!matchedScript) {
    return { type: 'normal' }
  }

  switch (matchedScript.tag) {
    case 'nervos dao':
      if (cell.data === DEPOSIT_DAO_DATA) {
        return { type: 'nervos_dao_deposit' }
      }

      return { type: 'nervos_dao_withdrawing' }
    case 'sudt':
      return { type: 'udt' }
    case 'm-nft_issuer':
      return { type: 'm_nft_issuer' }
    case 'm-nft_class':
      return { type: 'm_nft_class' }
    case 'm-nft':
      return { type: 'm_nft_token' }
    case 'cota_registry':
      return { type: 'cota_registry' }
    case 'cota':
      return { type: 'cota_regular' }
    case 'Spore Cluster':
      return { type: 'spore_cluster' }
    case 'Spore':
      return { type: 'spore' }
    case 'xUDT':
      return { type: 'xudt' }
    case 'Unique Cell':
      return { type: 'unique_cell' }
    default:
      break
  }

  return { type: 'normal' }
}

export function calculateScriptHash(script: Script): string {
  return ckbHash(blockchain.Script.pack(script))
}

export const getUDTAmountByData = (data: string) => {
  // to big endian
  const bytes = data.slice(2).match(/\w{2}/g)
  if (!bytes) return '0x00'
  const be = `0x${bytes.reverse().join('')}`
  if (Number.isNaN(+be)) {
    throw new Error('Invalid little-endian')
  }
  return BI.from(be).toHexString()
}

export const cellOccupied = (cell: Cell) => {
  return minimalCellCapacityCompatible(cell).toNumber()
}

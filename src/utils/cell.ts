import type { Cell, Script } from '@ckb-lumos/base'
import { ckbHash } from '@ckb-lumos/base/lib/utils'
import { minimalCellCapacityCompatible } from '@ckb-lumos/helpers'
import { blockchain } from '@ckb-lumos/base'
import { BI } from '@ckb-lumos/bi'
import { IS_MAINNET } from '../constants/common'
import { MainnetContractHashTags, TestnetContractHashTags } from '../constants/scripts'

const DEPOSIT_DAO_DATA = '0x0000000000000000'

export const UDT_CELL_TYPES = ['sudt', 'xudt', 'omiga_inscription', 'xudt_compatible']

export function getCellType(cell: Cell): string {
  const scriptSet = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags

  const cellTypeScript = cell.cellOutput.type

  if (!cellTypeScript) {
    return 'normal'
  }

  const matchedScript = scriptSet.find(script =>
    script.codeHashes.find(codeHash => codeHash === cellTypeScript.codeHash),
  )

  if (!matchedScript) {
    return 'normal'
  }

  switch (matchedScript.tag) {
    case 'nervos dao':
      if (cell.data === DEPOSIT_DAO_DATA) {
        return 'nervos_dao_deposit'
      }

      return 'nervos_dao_withdrawing'
    case 'sudt':
      return 'udt'
    case 'm-nft_issuer':
      return 'm_nft_issuer'
    case 'm-nft_class':
      return 'm_nft_class'
    case 'm-nft':
      return 'm_nft_token'
    case 'cota_registry':
      return 'cota_registry'
    case 'cota':
      return 'cota_regular'
    case 'Spore Cluster':
      return 'spore_cluster'
    case 'Spore':
      return 'spore'
    case 'xUDT':
      return 'xudt'
    case 'Unique Cell':
      return 'unique_cell'
    default:
      break
  }

  return 'normal'
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

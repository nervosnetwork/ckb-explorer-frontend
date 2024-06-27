import { LiteTransfer } from '../services/ExplorerService'
import { parseUDTAmount } from './number'
import { formatNftDisplayId } from './util'

export type DiffStatus = 'positive' | 'negative' | 'none'

interface TransferRecord {
  label: string
  diffStatus: DiffStatus
  category: LiteTransfer.Transfer['cellType']
  capacity: string
  asset?: {
    amount: string
    item: string
    diffStatus: DiffStatus
  } | null
  assets?: {
    name: string
    count: string
    tokenId: string
    diffStatus: DiffStatus
  }[]
}
export const getDiffStatus = (value: number): DiffStatus => {
  if (value < 0) {
    return 'negative'
  }
  if (value > 0) {
    return 'positive'
  }
  return 'none'
}

export const getTransfer = (transfer: LiteTransfer.Transfer): TransferRecord => {
  try {
    switch (transfer.cellType) {
      case 'normal': {
        return {
          label: 'CKB',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: 'normal',
          capacity: transfer.capacity,
          asset: null,
        }
      }
      case 'udt': {
        if (!transfer.udtInfo) {
          throw new Error('Missing udtInfo')
        }
        if (!transfer.udtInfo.decimal) {
          return {
            label: `Unknown Asset`,
            diffStatus: getDiffStatus(+transfer.capacity),
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              amount: 'Unknown Amount',
              item: '',
              diffStatus: getDiffStatus(+transfer.udtInfo.amount),
            },
          }
        }
        const decimal = +transfer.udtInfo.decimal
        let amount = decimal ? parseUDTAmount(transfer.udtInfo.amount, decimal) : transfer.udtInfo.amount
        const diffStatus = getDiffStatus(+transfer.udtInfo.amount)
        if (diffStatus === 'positive') {
          amount = `+${amount}`
        }
        return {
          label: transfer.udtInfo.symbol || 'Unknown',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            amount,
            item: transfer.udtInfo.symbol || 'Unknown',
            diffStatus,
          },
        }
      }
      case 'omiga_inscription': {
        const info = transfer.udtInfo
        if (info) {
          const item = info?.symbol || 'Unknown'
          const diffStatus = getDiffStatus(+(info?.amount ?? 0))
          let amount = 'Unknown'
          if (info?.decimal && info.amount) {
            amount = parseUDTAmount(info.amount, +info.decimal)
          }
          // const info =
          return {
            label: 'Omiga Inscription',
            diffStatus: getDiffStatus(+transfer.capacity),
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              amount,
              item,
              diffStatus,
            },
          }
        }
        return {
          label: transfer.name,
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            amount: transfer.count,
            item: transfer.name,
            diffStatus: getDiffStatus(+transfer.count),
          },
        }
      }
      case 'xudt_compatible':
      case 'xudt': {
        if (!transfer.udtInfo) {
          throw new Error('Missing udtInfo')
        }
        if (!transfer.udtInfo.decimal) {
          return {
            label: `Unknown Asset`,
            diffStatus: getDiffStatus(+transfer.capacity),
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              amount: 'Unknown Amount',
              item: '',
              diffStatus: getDiffStatus(+transfer.udtInfo.amount),
            },
          }
        }
        const decimal = +transfer.udtInfo.decimal
        let amount = decimal ? parseUDTAmount(transfer.udtInfo.amount, decimal) : transfer.udtInfo.amount
        const diffStatus = getDiffStatus(+transfer.udtInfo.amount)
        if (diffStatus === 'positive') {
          amount = `+${amount}`
        }
        return {
          label: transfer.udtInfo.symbol || 'Unknown',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            amount,
            item: transfer.udtInfo.symbol || 'Unknown',
            diffStatus,
          },
        }
      }
      case 'm_nft_token': {
        const id = formatNftDisplayId(transfer.toeknId ?? transfer.tokenId, 'm_nft')
        const diffStatus = getDiffStatus(+transfer.count)
        const item = `${diffStatus === 'positive' ? '+' : ''}${transfer.count} Token ID: ${id}`
        return {
          label: `${transfer.name}`,
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            amount: '',
            item,
            diffStatus,
          },
        }
      }
      case 'm_nft_class': {
        return {
          label: 'M_NFT_CLASS',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'm_nft_issuer': {
        return {
          label: 'M_NFT_ISSUER',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'nrc_721_token': {
        const id = formatNftDisplayId(transfer.toeknId ?? transfer.tokenId, 'nrc_721')
        const diffStatus = getDiffStatus(+transfer.count)
        const item = `${diffStatus === 'positive' ? '+' : ''}${transfer.count} Token ID: ${id.slice(0, 6)}...${id.slice(
          -6,
        )}`
        return {
          label: transfer.name,
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            amount: '',
            item,
            diffStatus,
          },
        }
      }
      case 'nrc_721_factory': {
        return {
          label: 'NRC_721_FACTORY',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'did_cell':
      case 'spore_cell': {
        const id = formatNftDisplayId(transfer.toeknId ?? transfer.tokenId, 'spore')

        const diffStatus = getDiffStatus(+transfer.count)
        const item = `${diffStatus === 'positive' ? '+' : ''} ${transfer.count} Token ID: ${id.slice(
          0,
          6,
        )}...${id.slice(-6)}`
        return {
          label: transfer.name,
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item,
            amount: '',
            diffStatus,
          },
        }
      }
      case 'spore_cluster': {
        return {
          label: 'SPORE_CLUSTER',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'cota_regular': {
        if (transfer.cotaInfo.length === 1) {
          const asset = transfer.cotaInfo[0]
          const diffStatus = getDiffStatus(+asset.count)
          const item = `${diffStatus === 'positive' ? '+' : ''}${asset.count} Token ID: ${asset.tokenId}`
          return {
            label: asset.name,
            diffStatus: getDiffStatus(+transfer.capacity),
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              item,
              amount: '',
              diffStatus,
            },
          }
        }
        return {
          label: 'CoTA',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item: 'Multiple Token Change',
            amount: '0',
            diffStatus: 'none',
          },
          assets: transfer.cotaInfo.map(i => ({
            ...i,
            diffStatus: getDiffStatus(+i.count),
          })),
        }
      }
      case 'cota_registry': {
        return {
          label: 'COTA_REGISTRY',
          diffStatus: getDiffStatus(+transfer.capacity),
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      // TODO 'nervos_dao_deposit', 'nervos_dao_withdrawing': {}
      default: {
        throw new Error('Unknown cell type')
      }
    }
  } catch {
    return {
      label: 'Unknown',
      diffStatus: getDiffStatus(+transfer.capacity),
      category: transfer.cellType,
      capacity: transfer.capacity,
      asset: null,
    }
  }
}

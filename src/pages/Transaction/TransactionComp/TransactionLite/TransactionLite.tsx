/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import styles from './TransactionLite.module.scss'
import Capacity from '../../../../components/Capacity'
import { formatNftDisplayId, shannonToCkb } from '../../../../utils/util'
import { Addr } from '../../TransactionCell'
import { defaultTransactionLiteDetails } from '../../state'
import { LiteTransfer, explorerService } from '../../../../services/ExplorerService'
import { parseUDTAmount } from '../../../../utils/number'

type DiffStatus = 'positive' | 'negative' | 'none'

interface TransferRecord {
  label: string
  category: LiteTransfer.Transfer['cellType']
  capacity: string
  asset?: {
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
const getDiffStatus = (value: number): DiffStatus => {
  if (value < 0) {
    return 'negative'
  }
  if (value > 0) {
    return 'positive'
  }
  return 'none'
}

const getTransfer = (transfer: LiteTransfer.Transfer): TransferRecord => {
  try {
    switch (transfer.cellType) {
      case 'normal': {
        return {
          label: 'CKB',
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
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              item: 'Unknown Amount',
              diffStatus: getDiffStatus(+transfer.udtInfo.amount),
            },
          }
        }
        const decimal = +transfer.udtInfo.decimal
        let item = decimal ? parseUDTAmount(transfer.udtInfo.amount, decimal) : transfer.udtInfo.amount
        const diffStatus = getDiffStatus(+transfer.udtInfo.amount)
        if (diffStatus === 'positive') {
          item = `+${item}`
        }
        return {
          label: transfer.udtInfo.symbol || 'Unknown',
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item,
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
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item,
            diffStatus,
          },
        }
      }
      case 'm_nft_class': {
        return {
          label: 'M_NFT_CLASS',
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'm_nft_issuer': {
        return {
          label: 'M_NFT_ISSUER',
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
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item,
            diffStatus,
          },
        }
      }
      case 'nrc_721_factory': {
        return {
          label: 'NRC_721_FACTORY',
          category: transfer.cellType,
          capacity: transfer.capacity,
        }
      }
      case 'spore_cell': {
        const id = formatNftDisplayId(transfer.toeknId ?? transfer.tokenId, 'spore')

        const diffStatus = getDiffStatus(+transfer.count)
        const item = `${diffStatus === 'positive' ? '+' : ''} ${transfer.count} Token ID: ${id.slice(
          0,
          6,
        )}...${id.slice(-6)}`
        return {
          label: transfer.name,
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item,
            diffStatus,
          },
        }
      }
      case 'spore_cluster': {
        return {
          label: 'SPORE_CLUSTER',
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
            category: transfer.cellType,
            capacity: transfer.capacity,
            asset: {
              item,
              diffStatus,
            },
          }
        }
        return {
          label: 'CoTA',
          category: transfer.cellType,
          capacity: transfer.capacity,
          asset: {
            item: 'Multiple Token Change',
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
      category: transfer.cellType,
      capacity: transfer.capacity,
      asset: null,
    }
  }
}

export const TransactionCompLite: FC<{ isCellbase: boolean }> = ({ isCellbase }) => {
  const { hash: txHash } = useParams<{ hash: string }>()
  const [t] = useTranslation()

  const query = useQuery(
    ['ckb_transaction_details', txHash],
    async () => {
      const ckbTransactionDetails = await explorerService.api.fetchTransactionLiteDetailsByHash(txHash)
      return ckbTransactionDetails.data
    },
    {
      initialData: defaultTransactionLiteDetails,
    },
  )

  const txList = query.data.map(tx => ({
    address: tx.address,
    transfers: tx.transfers.map(getTransfer),
  }))

  return (
    <div className={styles.container}>
      {txList.map(item => (
        <div key={item.address} className={styles.item}>
          <div>
            <div className={styles.address}>
              <Addr address={item.address} isCellBase={isCellbase} />
            </div>
          </div>
          <table>
            {item.transfers.map(transfer => {
              const ckb = shannonToCkb(transfer.capacity)
              const ckbDiffStatus = getDiffStatus(+transfer.capacity)

              return (
                <>
                  <tr key={transfer.label} className={styles.transfer}>
                    <td className={styles.label}>
                      {transfer.label}
                      <span data-category={transfer.category}>{t(`transaction.${transfer.category}`)}</span>
                    </td>
                    <td className={styles.value}>
                      {transfer.asset ? (
                        <div className={styles.asset} data-diff-status={transfer.asset.diffStatus}>
                          <div>{transfer.asset.item}</div>
                        </div>
                      ) : null}
                      <div className={styles.ckb}>
                        {transfer.asset ? (
                          <span className={styles.parenthesis} data-diff-status={ckbDiffStatus}>
                            (
                          </span>
                        ) : null}
                        <Capacity capacity={ckb} type="diff" display="short" unit={transfer.asset ? 'CKB' : null} />
                        {transfer.asset ? (
                          <span className={styles.parenthesis} data-diff-status={ckbDiffStatus}>
                            )
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {transfer.assets?.map(a => {
                    return (
                      <tr className={styles.multipleAsset} key={`${a.name}-${a.tokenId}`}>
                        <td>{a.name}</td>
                        <td
                          data-diff-status={a.diffStatus}
                          className={styles.asset}
                        >{`${a.count} Token ID: ${a.tokenId}`}</td>
                      </tr>
                    )
                  }) ?? null}
                </>
              )
            })}
          </table>
        </div>
      ))}
    </div>
  )
}

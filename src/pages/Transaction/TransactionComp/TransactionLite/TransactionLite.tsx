/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import styles from './TransactionLite.module.scss'
import Capacity from '../../../../components/Capacity'
import { shannonToCkb } from '../../../../utils/util'
import { Addr } from '../../TransactionCell'
import { defaultTransactionLiteDetails } from '../../state'
import { LiteTransfer, explorerService } from '../../../../services/ExplorerService'
import { parseUDTAmount } from '../../../../utils/number'

interface TransferRecord {
  label: string
  capacity: string
  asset?: {
    item: string
    diffStatus: 'positive' | 'negative' | 'none'
  } | null
}
const getDiffStatus = (value: number) => {
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
          capacity: transfer.capacity,
          asset: {
            item,
            diffStatus,
          },
        }
      }
      case 'm_nft_token': {
        return {
          label: `${transfer.collectionName}`,
          capacity: transfer.capacity,
          asset: {
            item: `ID: ${transfer.tokenId}`,
            diffStatus: getDiffStatus(+transfer.count),
          },
        }
      }
      case 'm_nft_class': {
        return {
          label: 'M_NFT_CLASS',
          capacity: transfer.capacity,
        }
      }
      case 'm_nft_issuer': {
        return {
          label: 'M_NFT_ISSUER',
          capacity: transfer.capacity,
        }
      }
      case 'nrc_721_token': {
        return {
          label: transfer.collectionName,
          capacity: transfer.capacity,
          asset: {
            item: `ID: ${transfer.tokenId}`,
            diffStatus: getDiffStatus(+transfer.count),
          },
        }
      }
      case 'nrc_721_factory': {
        return {
          label: 'NRC_721_FACTORY',
          capacity: transfer.capacity,
        }
      }
      case 'spore_cell': {
        return {
          label: transfer.collectionName,
          capacity: transfer.capacity,
          asset: {
            item: `ID: ${transfer.tokenId}`,
            diffStatus: getDiffStatus(+transfer.count),
          },
        }
      }
      case 'spore_cluster': {
        return {
          label: 'SPORE_CLUSTER',
          capacity: transfer.capacity,
        }
      }
      case 'cota_regular': {
        return {
          label: transfer.cotaInfo.map(i => i.collectionName).join(', '),
          capacity: transfer.capacity,
        }
      }
      case 'cota_registry': {
        return {
          label: 'COTA_REGISTRY',
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
      capacity: transfer.capacity,
      asset: null,
    }
  }
}

export const TransactionCompLite: FC<{ isCellbase: boolean }> = ({ isCellbase }) => {
  const { hash: txHash } = useParams<{ hash: string }>()

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
                <tr key={transfer.label} className={styles.transfer}>
                  <td className={styles.label}>{transfer.label}</td>
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
              )
            })}
          </table>
        </div>
      ))}
    </div>
  )
}

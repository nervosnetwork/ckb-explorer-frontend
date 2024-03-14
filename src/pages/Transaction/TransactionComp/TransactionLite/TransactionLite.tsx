/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import styles from './TransactionLite.module.scss'
import Capacity from '../../../../components/Capacity'
import { shannonToCkb } from '../../../../utils/util'
import { Addr } from '../../TransactionCell'
import { defaultTransactionLiteDetails } from '../../state'
import { explorerService } from '../../../../services/ExplorerService'
import { getDiffStatus, getTransfer } from '../../../../utils/transfer'

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

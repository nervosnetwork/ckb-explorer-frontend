import { ReactNode, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import { ReactComponent as DirectionIcon } from '../../assets/direction.svg'
import { localeNumberString } from '../../utils/number'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionIncome from './TransactionIncome'
import { IOType } from '../../constants/common'
import AddressText from '../AddressText'
import { useParsedDate } from '../../hooks'
import { Transaction } from '../../models/Transaction'
import BtcTransaction from '../Btc/Transaction'
import RGBPP from '../RGBPP'
import { RawBtcRPC } from '../../services/ExplorerService'

export interface CircleCorner {
  top?: boolean
  bottom?: boolean
}

const Time: React.FC<{ tx?: Transaction }> = ({ tx }) => {
  const { t } = useTranslation()
  let timestamp = 0
  if (tx) {
    if (tx.blockTimestamp) {
      timestamp = +tx.blockTimestamp
    } else if (tx.createTimestamp) {
      // FIXME: round the timestamp because sometimes a decimal is returned from the API, could be removed when the API is fixed
      timestamp = Math.floor(Number(tx.createTimestamp))
    }
  }

  const dateTime = new Date(timestamp).toISOString()
  const localTime = useParsedDate(timestamp)

  if (!tx) {
    return null
  }

  if (tx.blockTimestamp) {
    return (
      <time dateTime={dateTime} className="transactionItemBlock">
        {`(${t('block.block')} ${localeNumberString(tx.blockNumber)}) ${localTime}`}
      </time>
    )
  }

  if (tx.createTimestamp) {
    return (
      <time dateTime={dateTime} className="transactionItemBlock">
        {localTime}
      </time>
    )
  }
  return null
}

const TransactionItem = ({
  transaction,
  address,
  isBlock = false,
  titleCard,
  circleCorner = {
    top: false,
    bottom: false,
  },
  scrollIntoViewOnMount,
}: {
  transaction: Transaction & { btcTx: RawBtcRPC.BtcTx | null }
  address?: string
  isBlock?: boolean
  titleCard?: ReactNode | null
  circleCorner?: CircleCorner
  scrollIntoViewOnMount?: boolean
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && scrollIntoViewOnMount) {
      const style = getComputedStyle(ref.current)
      const navbarHeight = parseInt(style.getPropertyValue('--navbar-height'), 10)
      const marginTop = parseInt(style.getPropertyValue('margin-top'), 10)
      const y = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight - marginTop
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const boundCellIndex = useMemo(() => {
    const map: Record<string, number> = {}
    transaction.displayInputs.forEach((input, idx) => {
      if (!input.rgbInfo) return
      map[`${input.rgbInfo.txid}-${input.rgbInfo.index}`] = idx
    })
    transaction.displayOutputs.forEach((output, idx) => {
      if (!output.rgbInfo) return
      map[`${output.rgbInfo.txid}-${output.rgbInfo.index}`] = idx
    })
    return map
  }, [transaction])

  return (
    <>
      <div
        ref={ref}
        className={classNames(styles.transactionPanel, 'transactionPanel')}
        style={{
          borderRadius: circleCorner.top ? '6px 6px' : '0 0',
          borderBottomLeftRadius: circleCorner.bottom ? '6px 6px' : '0 0',
        }}
      >
        {titleCard}
        <div className={styles.transactionHashBlockPanel}>
          <div className="transactionItemContent">
            <div className={styles.left}>
              <AddressText
                disableTooltip
                className="transactionItemHash"
                linkProps={{
                  to: `/transaction/${transaction.transactionHash}`,
                }}
              >
                {transaction.transactionHash}
              </AddressText>
              {transaction.isRgbTransaction && transaction.rgbTransferStep && <RGBPP transaction={transaction} />}
            </div>
            <div className={styles.right}>
              <Time tx={isBlock ? undefined : transaction} />
            </div>
          </div>
        </div>
        <div className={styles.transactionCellPanel}>
          <div className="transactionItemInput">
            <TransactionCellList
              cells={transaction.displayInputs}
              transaction={transaction}
              render={cell => (
                <TransactionCell
                  cell={{ ...cell, consumedTxHash: transaction.transactionHash }}
                  address={address}
                  ioType={IOType.Input}
                  key={cell.id}
                />
              )}
            />
          </div>
          <DirectionIcon className={styles.direction} />
          <div className="transactionItemOutput">
            {transaction.displayOutputs && transaction.displayOutputs.length !== 0 ? (
              <TransactionCellList
                cells={transaction.displayOutputs}
                transaction={transaction}
                render={cell => (
                  <div className={styles.fullPanel} key={cell.id}>
                    <TransactionCell cell={cell} address={address} ioType={IOType.Output} />
                  </div>
                )}
              />
            ) : (
              <div className="transactionItemOutputEmpty">{t('transaction.empty_output')}</div>
            )}
          </div>
        </div>
        {address && <TransactionIncome income={transaction.income} />}
      </div>
      {transaction.isRgbTransaction && transaction.btcTx?.vout.some(v => v.scriptPubKey.asm.includes('OP_RETURN')) ? (
        <div className={styles.btcTxContent}>
          <BtcTransaction tx={transaction.btcTx} boundCellIndex={boundCellIndex} />
        </div>
      ) : null}
    </>
  )
}

export default TransactionItem

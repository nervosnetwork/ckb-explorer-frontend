import { ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import styles from './styles.module.scss'
import RightArrowIcon from './input_arrow_output.png'
import DownArrowIcon from './input_arrow_output_down.png'
import { localeNumberString } from '../../utils/number'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionIncome from './TransactionIncome'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel, RGBPlusPlus } from './styled'
import { CellType } from '../../constants/common'
import AddressText from '../AddressText'
import { useIsExtraLarge, useParsedDate } from '../../hooks'
import { Transaction } from '../../models/Transaction'
import SimpleButton from '../SimpleButton'
import SimpleModal from '../Modal'
import TransactionRGBPPDigestModal from './TransactionRGBPPDigestModal'
import { TransactionLeapDirection } from './TransactionRGBPPDigestModal/types'
import { matchScript } from '../../utils/util'
import { Cell } from '../../models/Cell'

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

const computeRGBPPCellAmount = (cells: Cell[]) =>
  cells.filter(cell => {
    const script = addressToScript(cell.addressHash)
    try {
      const tag = matchScript(script.codeHash, script.hashType)
      return tag?.tag === 'rgb++'
    } catch (e) {
      return false
    }
  })

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
  transaction: Transaction
  address?: string
  isBlock?: boolean
  titleCard?: ReactNode | null
  circleCorner?: CircleCorner
  scrollIntoViewOnMount?: boolean
}) => {
  const isXL = useIsExtraLarge()
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)

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

  const inputRGBAmount = computeRGBPPCellAmount(transaction.displayInputs)
  const outputRGBAmount = computeRGBPPCellAmount(transaction.displayOutputs)

  return (
    <TransactionPanel ref={ref} circleCorner={circleCorner}>
      {titleCard}
      <TransactionHashBlockPanel>
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
            {transaction.rgbTransaction && (
              <SimpleButton
                onClick={() => {
                  setShowModal(true)
                }}
              >
                <RGBPlusPlus>
                  <span>RGB++</span>
                </RGBPlusPlus>
              </SimpleButton>
            )}
            <SimpleModal isShow={showModal} setIsShow={setShowModal}>
              <TransactionRGBPPDigestModal
                onClickClose={() => setShowModal(false)}
                hash={transaction.transactionHash}
                leapDirection={
                  inputRGBAmount > outputRGBAmount ? TransactionLeapDirection.OUT : TransactionLeapDirection.IN
                }
              />
            </SimpleModal>
          </div>
          <div className={styles.right}>
            <Time tx={isBlock ? undefined : transaction} />
          </div>
        </div>
      </TransactionHashBlockPanel>
      <TransactionCellPanel>
        <div className="transactionItemInput">
          <TransactionCellList
            cells={transaction.displayInputs}
            transaction={transaction}
            render={cell => <TransactionCell cell={cell} address={address} cellType={CellType.Input} key={cell.id} />}
          />
        </div>
        <img src={isXL ? DownArrowIcon : RightArrowIcon} alt="input and output" />
        <div className="transactionItemOutput">
          {transaction.displayOutputs && transaction.displayOutputs.length !== 0 ? (
            <TransactionCellList
              cells={transaction.displayOutputs}
              transaction={transaction}
              render={cell => (
                <FullPanel key={cell.id}>
                  <TransactionCell cell={cell} address={address} cellType={CellType.Output} />
                </FullPanel>
              )}
            />
          ) : (
            <div className="transactionItemOutputEmpty">{t('transaction.empty_output')}</div>
          )}
        </div>
      </TransactionCellPanel>
      {address && <TransactionIncome income={transaction.income} />}
    </TransactionPanel>
  )
}

export default TransactionItem

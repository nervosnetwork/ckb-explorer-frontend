import { useTranslation } from 'react-i18next'
import { MouseEventHandler } from 'react'
import styles from './HolderAllocation.module.scss'
import { localeNumberString } from '../../utils/number'
import CloseIcon from '../../assets/modal_close.png'
import SimpleButton from '../../components/SimpleButton'
import { matchScript } from '../../utils/util'
import EllipsisMiddle from '../../components/EllipsisMiddle'
import { Link } from '../../components/Link'
import { LockHolderAmount } from '../../models/Xudt'

const HolderAllocation = ({
  ckbHolderAmount,
  btcHolderAmount,
  lockHoderAmount,
  onClose,
}: {
  ckbHolderAmount: string
  btcHolderAmount: string
  lockHoderAmount?: LockHolderAmount[]
  onClose: MouseEventHandler<HTMLDivElement>
}) => {
  const [t] = useTranslation()
  return (
    <div className={styles.holderAllocationContainer}>
      <div className={styles.holderAllocationContent}>
        <h2>{t('xudt.holder_allocation')}</h2>
        <p>
          {t('xudt.holder_allocation_description', {
            ckb: ckbHolderAmount,
            btc: localeNumberString(btcHolderAmount),
          })}
        </p>
        {lockHoderAmount && (
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <td>
                    <div>{t('xudt.lock_hash')}</div>
                  </td>
                  <td>
                    <div>{t('xudt.count')}</div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {parseInt(btcHolderAmount, 10) > 0 && (
                  <tr>
                    <td>
                      <div>BTC</div>
                    </td>
                    <td>
                      <div>{localeNumberString(btcHolderAmount)}</div>
                    </td>
                  </tr>
                )}
                {lockHoderAmount
                  .sort((a, b) => +b.holderCount - +a.holderCount)
                  .map(amount => (
                    <tr>
                      <td>
                        <LockHash amount={amount} />
                      </td>
                      <td>
                        <div>{localeNumberString(amount.holderCount)}</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SimpleButton onClick={onClose} className={styles.closeIcon}>
        <img src={CloseIcon} alt="close icon" />
      </SimpleButton>
    </div>
  )
}

const LockHash = ({ amount }: { amount: LockHolderAmount }) => {
  const script = matchScript(amount.codeHash)
  return script ? (
    <EllipsisMiddle>{script.tag}</EllipsisMiddle>
  ) : (
    <Link className={styles.scriptLink} to={`/script/${amount.codeHash}/${amount.hashType}`}>
      <EllipsisMiddle>{amount.codeHash}</EllipsisMiddle>
    </Link>
  )
}

export default HolderAllocation

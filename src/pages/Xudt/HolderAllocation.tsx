import { useTranslation } from 'react-i18next'
import { MouseEventHandler } from 'react'
import styles from './HolderAllocation.module.scss'
import { localeNumberString } from '../../utils/number'
import CloseIcon from '../../assets/modal_close.png'
import SimpleButton from '../../components/SimpleButton'

const HolderAllocation = ({
  ckbHolderAmount,
  btcHolderAmount,
  lockHoderAmount,
  onClose,
}: {
  ckbHolderAmount: string
  btcHolderAmount: string
  lockHoderAmount?: {
    lock: string
    holderAmount: string
  }[]
  onClose: MouseEventHandler<HTMLDivElement>
}) => {
  const [t] = useTranslation()
  return (
    <div className={styles.holderAllocationContainer}>
      <div className={styles.holderAllocationContent}>
        <h2>{t('xudt.holder_allocation')}</h2>
        <p>
          {t('xudt.holder_allocation_description', {
            ckb: localeNumberString(ckbHolderAmount),
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
                {lockHoderAmount.map(amount => (
                  <tr>
                    <td>
                      <div>{amount.lock}</div>
                    </td>
                    <td>
                      <div>{amount.holderAmount}</div>
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

export default HolderAllocation

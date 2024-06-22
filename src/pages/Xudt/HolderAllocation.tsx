import { useTranslation } from 'react-i18next'
import { MouseEventHandler } from 'react'
import styles from './HolderAllocation.module.scss'
import { localeNumberString } from '../../utils/number'
import CloseIcon from '../../assets/modal_close.png'
import SimpleButton from '../../components/SimpleButton'

const HolderAllocation = ({
  allocation,
  onClose,
}: {
  allocation: Record<string, number>
  onClose: MouseEventHandler<HTMLDivElement>
}) => {
  const [t] = useTranslation()
  const total = Object.values(allocation).reduce((acc, cur) => acc + cur, 0)
  const btc = allocation.BTC
  const ckb = total - btc
  return (
    <div className={styles.holderAllocationContainer}>
      <div className={styles.holderAllocationContent}>
        <h2>{t('xudt.holder_allocation')}</h2>
        <p>
          {t('xudt.holder_allocation_description', {
            ckb: localeNumberString(ckb),
            btc: localeNumberString(btc),
          })}
        </p>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <td>
                  <div>{t('xudt.category')}</div>
                </td>
                <td>
                  <div>{t('xudt.count')}</div>
                </td>
              </tr>
            </thead>
            <tbody>
              {Object.entries(allocation).map(([label, count]) => {
                return (
                  <tr>
                    <td>
                      <div>{label}</div>
                    </td>
                    <td>
                      <div>{localeNumberString(count)}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SimpleButton onClick={onClose} className={styles.closeIcon}>
        <img src={CloseIcon} alt="close icon" />
      </SimpleButton>
    </div>
  )
}

export default HolderAllocation

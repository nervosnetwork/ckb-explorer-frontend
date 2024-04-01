import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Transaction } from '../../models/Transaction'
import SimpleModal from '../Modal'
import SimpleButton from '../SimpleButton'
import TransactionRGBPPDigestModal from '../TransactionItem/TransactionRGBPPDigestModal'
import styles from './styles.module.scss'
import { TransactionLeapDirection } from './types'

const RGBPP = ({ transaction }: { transaction: Transaction }) => {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const direction = useMemo(() => {
    // FIXME: should be from API because inputs/outputs are paginated
    const inputCellCount = transaction.displayInputs.filter(c => c.rgbInfo).length
    const outputCellCount = transaction.displayOutputs.filter(c => c.rgbInfo).length
    if (inputCellCount === outputCellCount) {
      return TransactionLeapDirection.NONE
    }
    if (inputCellCount > outputCellCount) {
      return TransactionLeapDirection.OUT
    }
    return TransactionLeapDirection.IN
  }, [transaction])

  return (
    <div>
      <SimpleButton
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div className={styles.rgbpp}>
          <span>{t('transaction.view_rgbpp_digest')}</span>
        </div>
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionRGBPPDigestModal
          onClickClose={() => setShowModal(false)}
          hash={transaction.transactionHash}
          leapDirection={direction}
        />
      </SimpleModal>
    </div>
  )
}

export default RGBPP

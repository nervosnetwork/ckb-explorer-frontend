import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Transaction } from '../../models/Transaction'
import SimpleModal from '../Modal'
import SimpleButton from '../SimpleButton'
import TransactionRGBPPDigestModal from '../TransactionItem/TransactionRGBPPDigestModal'
import styles from './styles.module.scss'

const RGBPP = ({ transaction }: { transaction: Transaction }) => {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  return (
    <div>
      <SimpleButton
        onClick={() => {
          setShowModal(true)
        }}
      >
        <div className={styles.rgbpp}>
          <span>RGB++: {t(`rgbpp.transaction.step.${transaction.rgbTransferStep}`)}</span>
        </div>
      </SimpleButton>
      <SimpleModal isShow={showModal} setIsShow={setShowModal}>
        <TransactionRGBPPDigestModal onClickClose={() => setShowModal(false)} hash={transaction.transactionHash} />
      </SimpleModal>
    </div>
  )
}

export default RGBPP

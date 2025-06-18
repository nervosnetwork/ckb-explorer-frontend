import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Link } from '../../components/Link'
import { ReactComponent as OpenInNew } from '../../assets/open_in_new.svg'
import { deprecatedAddrToNewAddr } from '../../utils/util'
import styles from './styles.module.scss'
import AddressText from '../../components/AddressText'
import Tooltip from '../../components/Tooltip'

const IssuerContent: FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation()
  if (!address) {
    return t('address.unable_decode_address')
  }
  const newAddress = deprecatedAddrToNewAddr(address)

  return (
    <>
      <AddressText
        linkProps={{
          to: `/address/${newAddress}`,
        }}
      >
        {newAddress}
      </AddressText>

      {newAddress !== address && (
        <Tooltip
          trigger={
            <Link to={`/address/${address}`} className={styles.openInNew} target="_blank">
              <OpenInNew />
            </Link>
          }
          placement="top"
        >
          {t(`udt.view-deprecated-address`)}
        </Tooltip>
      )}
    </>
  )
}

export default IssuerContent

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import Content from '../../components/Content'
import { AddressContentPanel } from './styled'
import { NodeAddressOverviewCard, NodeAddressTransactions } from './AddressComp'
import { useDeprecatedAddr, useNewAddr } from '../../hooks'
import { Card, HashCardHeader } from '../../components/Card'
import { ReactComponent as ShareIcon } from './share.svg'
import styles from './styles.module.scss'
import { Link } from '../../components/Link'
import Qrcode from '../../components/Qrcode'
import { DASInfo } from './AddressPage'

export const NodeAddressPage = () => {
  const { address } = useParams<{ address: string }>()
  const { t } = useTranslation()

  const newAddr = useNewAddr(address)
  const deprecatedAddr = useDeprecatedAddr(address)
  const counterpartAddr = newAddr === address ? deprecatedAddr : newAddr

  return (
    <Content>
      <AddressContentPanel className="container">
        <Card>
          <HashCardHeader
            title={t('address.address')}
            hash={address}
            customActions={[
              <Qrcode text={address} />,
              counterpartAddr ? (
                <Tooltip
                  placement="top"
                  title={t(`address.${newAddr === address ? 'visit-deprecated-address' : 'view-new-address'}`)}
                >
                  <Link
                    className={styles.openInNew}
                    to={`/address/${counterpartAddr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShareIcon />
                  </Link>
                </Tooltip>
              ) : null,
            ]}
            rightContent={<DASInfo address={address} />}
          />
        </Card>

        <NodeAddressOverviewCard address={address} />

        <NodeAddressTransactions address={address} />
      </AddressContentPanel>
    </Content>
  )
}

export default NodeAddressPage

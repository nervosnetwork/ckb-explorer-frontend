import { FC } from 'react'
import { Cell } from '@ckb-lumos/base'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { Link } from '../../Link'
import { shannonToCkb } from '../../../utils/util'
import { TransactionCellPanel, TransactionCellCapacityPanel } from './styled'
import Capacity from '../../Capacity'
import { encodeNewAddress } from '../../../utils/address'
import styles from './index.module.scss'
import { useBoolean } from '../../../hooks'
import CopyTooltipText from '../../Text/CopyTooltipText'
import EllipsisMiddle from '../../EllipsisMiddle'

const Address: FC<{
  address: string
  to?: string
}> = ({ address, to }) => {
  const [truncated, truncatedCtl] = useBoolean(false)

  const content = (
    <Tooltip trigger={truncated ? 'hover' : []} placement="top" title={<CopyTooltipText content={address} />}>
      <EllipsisMiddle className={classNames('monospace', styles.text)} onTruncateStateChange={truncatedCtl.toggle}>
        {address}
      </EllipsisMiddle>
    </Tooltip>
  )

  return (
    <div className={classNames(styles.addressTextWithAlias, styles.addressWidthModify)}>
      {to ? (
        <Link className={styles.link} to={to}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}

const NodeTransactionItemCell = ({ cell }: { cell: Cell }) => {
  const address = encodeNewAddress(cell.cellOutput.lock)

  return (
    <TransactionCellPanel highLight>
      <div className="transactionCellAddress">
        <Address address={address} to={`/address/${address}`} />
      </div>
      <TransactionCellCapacityPanel>
        <div className="transactionCellWithoutIcon">
          <Capacity capacity={shannonToCkb(cell.cellOutput.capacity)} />
        </div>
      </TransactionCellCapacityPanel>
    </TransactionCellPanel>
  )
}

export default NodeTransactionItemCell

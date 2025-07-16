import { FC } from 'react'
import { Cell } from '@ckb-ccc/core'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import { NodeCellCapacityAmount } from './NodeCellCapacityAmount'
import CurrentAddressIcon from '../../../assets/current_address.svg'
import { encodeNewAddress, compareAddress } from '../../../utils/address'
import styles from './index.module.scss'
import CopyTooltipText from '../../Text/CopyTooltipText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { IOType } from '../../../constants/common'
import { CellInputIcon, CellOutputIcon } from '../../Transaction/TransactionCellArrow'
import { useCKBNode } from '../../../hooks/useCKBNode'
import Tooltip from '../../Tooltip'

const Address: FC<{
  address: string
  to?: string
}> = ({ address, to }) => {
  const content = (
    <Tooltip
      trigger={<EllipsisMiddle className={classNames('monospace', styles.text)}>{address}</EllipsisMiddle>}
      placement="top"
    >
      <CopyTooltipText content={address} />
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

const NodeTransactionItemCell = ({
  cell,
  ioType,
  highlightAddress,
}: {
  cell: Cell
  ioType?: IOType
  highlightAddress?: string
}) => {
  const address = encodeNewAddress(cell.cellOutput.lock)
  const { t } = useTranslation()
  const { nodeService } = useCKBNode()

  const cellStatus = useQuery(
    ['cellStatus', cell.outPoint.hash()],
    async () => {
      if (!cell.outPoint) return 'dead'
      const liveCell = await nodeService.rpc.getCellLive(cell.outPoint, false)
      if (liveCell) return 'live'
      return 'dead'
    },
    { enabled: cell.outPoint && ioType && ioType === IOType.Output },
  )

  const highLight = !highlightAddress || !compareAddress(highlightAddress, address)

  return (
    <div className={classNames(styles.transactionCellPanel, highLight && styles.highLight)}>
      {ioType && ioType === IOType.Input && (
        <CellInputIcon cell={{ generatedTxHash: cell.outPoint?.txHash, cellIndex: cell.outPoint?.index.toString() }} />
      )}
      <div className="transactionCellAddress">
        <Address address={address} to={`/address/${address}`} />
        {ioType === IOType.Output && <CellOutputIcon cell={{ status: cellStatus.data ?? 'dead' }} />}
        {!highLight && (
          <Tooltip
            trigger={<img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />}
            placement="top"
          >
            {`${t('address.current-address')} `}
          </Tooltip>
        )}
      </div>
      <div className={styles.transactionCellCapacityPanel}>
        <div className="transactionCellWithoutIcon">
          <NodeCellCapacityAmount cell={cell} />
        </div>
      </div>
    </div>
  )
}

export default NodeTransactionItemCell

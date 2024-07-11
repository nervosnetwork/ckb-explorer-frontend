import { FC } from 'react'
import { Cell } from '@ckb-lumos/base'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '../../Link'
import { TransactionCellPanel, TransactionCellCapacityPanel } from './styled'
import { NodeCellCapacityAmount } from './NodeCellCapacityAmount'
import CurrentAddressIcon from '../../../assets/current_address.svg'
import { encodeNewAddress, compareAddress } from '../../../utils/address'
import styles from './index.module.scss'
import { useBoolean } from '../../../hooks'
import CopyTooltipText from '../../Text/CopyTooltipText'
import EllipsisMiddle from '../../EllipsisMiddle'
import { IOType } from '../../../constants/common'
import { CellInputIcon, CellOutputIcon } from '../../Transaction/TransactionCellArrow'
import { useCKBNode } from '../../../hooks/useCKBNode'

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
    ['cellStatus', cell.outPoint],
    async () => {
      if (!cell.outPoint) return 'dead'
      const liveCell = await nodeService.rpc.getLiveCell(cell.outPoint, false)
      if (liveCell.status === 'live') return 'live'
      return 'dead'
    },
    { enabled: cell.outPoint && ioType && ioType === IOType.Output },
  )

  const highLight = !highlightAddress || !compareAddress(highlightAddress, address)

  return (
    <TransactionCellPanel highLight={highLight}>
      {ioType && ioType === IOType.Input && (
        <CellInputIcon cell={{ generatedTxHash: cell.outPoint?.txHash, cellIndex: cell.outPoint?.index }} />
      )}
      <div className="transactionCellAddress">
        <Address address={address} to={`/address/${address}`} />
        {ioType === IOType.Output && <CellOutputIcon cell={{ status: cellStatus.data ?? 'dead' }} />}
        {!highLight && (
          <Tooltip placement="top" title={`${t('address.current-address')} `}>
            <img className={styles.currentAddressIcon} src={CurrentAddressIcon} alt="current Address" />
          </Tooltip>
        )}
      </div>
      <TransactionCellCapacityPanel>
        <div className="transactionCellWithoutIcon">
          <NodeCellCapacityAmount cell={cell} />
        </div>
      </TransactionCellCapacityPanel>
    </TransactionCellPanel>
  )
}

export default NodeTransactionItemCell

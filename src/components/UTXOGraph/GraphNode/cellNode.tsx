import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TFunction, useTranslation } from 'react-i18next'
import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { Cell } from '../../../models/Cell'
import { explorerService } from '../../../services/ExplorerService'
import { IS_MAINNET } from '../../../constants/common'
import { getBtcUtxo, shannonToCkb } from '../../../utils/util'
import { CellBasicInfo } from '../../../utils/transformer'
import { ReactComponent as MoreIcon } from '../../../assets/more.svg'
import { BTCExplorerLink, Link } from '../../Link'
import styles from '../styles.module.scss'
import Popover from '../../Popover'

export const useGenerateMenuItem = ({
  t,
  address,
  btcUtxo,
  onViewCell,
  cell,
}: {
  cell: CellBasicInfo
  t: TFunction
  address?: string
  btcUtxo?: ReturnType<typeof getBtcUtxo>
  onViewCell: (cell: CellBasicInfo) => void
}) => {
  return useMemo(
    () => [
      {
        label: address ? (
          <Link to={`/address/${address}`} target="_blank">
            {t('utxo_graph.view_address')}
          </Link>
        ) : null,
        key: 'address',
      },
      ...(btcUtxo
        ? [
            {
              label: (
                <BTCExplorerLink
                  className={styles.action}
                  id={btcUtxo.txid}
                  anchor={`vout=${parseInt(btcUtxo.index!, 16)}`}
                  path="/tx"
                >
                  {t('utxo_graph.view_btc_utxo')}
                </BTCExplorerLink>
              ),
              key: 'btc-utxo',
            },
          ]
        : []),
      {
        label: (
          <button
            type="button"
            onClick={() => {
              onViewCell(cell)
            }}
            className={styles.viewCell}
          >
            {t('utxo_graph.view_cell_info')}
          </button>
        ),
        key: 'cell',
      },
    ],
    [t, address, btcUtxo, onViewCell, cell],
  )
}

const CellNode = (props: Cell & { onViewCell: (cell: CellBasicInfo) => void }) => {
  const {
    capacity,
    occupiedCapacity,
    status,
    id,
    onViewCell,
    generatedTxHash,
    consumedTxHash,
    isGenesisOutput,
    rgbInfo,
    cellIndex,
  } = props
  const { t } = useTranslation()
  const { data: cell } = useQuery(['lock', id], async () => {
    try {
      if (id) {
        const res = await explorerService.api.fetchScript('lock_scripts', `${id}`)
        return res?.attributes
      }
    } catch (e) {
      return undefined
    }
  })
  const address = useMemo(() => (cell ? scriptToAddress(cell as CKBComponents.Script, IS_MAINNET) : undefined), [cell])
  const btcUtxo = useMemo(() => (cell ? getBtcUtxo(cell) : undefined), [cell])
  const items = useGenerateMenuItem({
    t,
    address,
    btcUtxo,
    onViewCell,
    cell: {
      capacity,
      occupiedCapacity,
      id,
      generatedTxHash,
      consumedTxHash,
      isGenesisOutput,
      rgbInfo,
      cellIndex,
      status,
    },
  })
  if (isGenesisOutput) {
    return <div className={styles.cellNodeContainer}>Cellbase for Block</div>
  }
  return (
    <div className={styles.cellNodeContainer}>
      <span className={styles.cellStatus} data-status={status} />
      <span>{`${(+shannonToCkb(capacity)).toLocaleString('en')} CKB`}</span>
      <Popover
        trigger={
          <button type="button" className={styles.more} onClick={e => e.stopPropagation()}>
            <MoreIcon />
          </button>
        }
      >
        {items.map(item => {
          return <div key={item.key}>{item.label}</div>
        })}
      </Popover>
    </div>
  )
}

export default CellNode

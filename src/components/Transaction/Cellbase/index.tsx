import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CellbasePanel } from './styled'
import { CellType } from '../../../constants/common'
import TransactionCellArrow from '../TransactionCellArrow'
import { localeNumberString } from '../../../utils/number'
import HelpIcon from '../../../assets/qa_help.png'
import i18n from '../../../utils/i18n'
import styles from './index.module.scss'

const Cellbase = ({ cell, cellType, isDetail }: { cell: State.Cell; cellType: CellType; isDetail?: boolean }) => {
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      <CellbasePanel>
        <div className="cellbase__content">Cellbase</div>
      </CellbasePanel>
    )
  }

  const tooltipHtml = i18n.t('transaction.cellbase_help_tooltip', {
    consensus: `<a href="https://docs.nervos.org/docs/basics/concepts/consensus/" target="_blank">${i18n.t(
      'transaction.consensus_protocol',
    )}</a>`,
  })
  // eslint-disable-next-line react/no-danger
  const tooltipContent = <div dangerouslySetInnerHTML={{ __html: tooltipHtml }} />

  return (
    <CellbasePanel isDetail={isDetail}>
      {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
      <div className="cellbase__content">Cellbase for Block</div>
      <Tooltip overlayClassName={styles.tooltip} placement="top" title={tooltipContent}>
        <img className="cellbase__help__icon" alt="cellbase help" src={HelpIcon} />
      </Tooltip>
      <Link to={`/block/${cell.targetBlockNumber}`}>{localeNumberString(cell.targetBlockNumber)}</Link>
    </CellbasePanel>
  )
}

export default Cellbase

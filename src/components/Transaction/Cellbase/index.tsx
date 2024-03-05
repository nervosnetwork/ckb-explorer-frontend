import { Tooltip } from 'antd'
import { Trans } from 'react-i18next'
import { Link } from '../../Link'
import { CellbasePanel } from './styled'
import { CellType } from '../../../constants/common'
import TransactionCellArrow from '../TransactionCellArrow'
import { localeNumberString } from '../../../utils/number'
import HelpIcon from '../../../assets/qa_help.png'
import styles from './index.module.scss'
import { Cell } from '../../../models/Cell'

const Cellbase = ({ cell, cellType, isDetail }: { cell: Cell; cellType: CellType; isDetail?: boolean }) => {
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      <CellbasePanel>
        <div className="cellbaseContent">Cellbase</div>
      </CellbasePanel>
    )
  }

  const tooltipContent = (
    <Trans
      i18nKey="glossary.cellbase_for_block"
      components={{
        // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
        link1: <a href="https://docs.nervos.org/docs/basics/concepts/consensus/" target="_blank" rel="noreferrer" />,
      }}
    />
  )

  return (
    <CellbasePanel isDetail={isDetail}>
      {cellType === CellType.Input && <TransactionCellArrow cell={cell} cellType={cellType} />}
      <div className="cellbaseContent">Cellbase for Block</div>
      <Tooltip overlayClassName={styles.tooltip} placement="top" title={tooltipContent}>
        <img className="cellbaseHelpIcon" alt="cellbase help" src={HelpIcon} />
      </Tooltip>
      <Link to={`/block/${cell.targetBlockNumber}`}>{localeNumberString(cell.targetBlockNumber)}</Link>
    </CellbasePanel>
  )
}

export default Cellbase

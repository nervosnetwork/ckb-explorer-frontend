import { Trans } from 'react-i18next'
import classNames from 'classnames'
import { Link } from '../../Link'
import { CellInputIcon } from '../TransactionCellArrow'
import { localeNumberString } from '../../../utils/number'
import HelpIcon from '../../../assets/qa_help.png'
import styles from './index.module.scss'
import { Cell } from '../../../models/Cell'
import Tooltip from '../../Tooltip'

const Cellbase = ({
  cell,
  isDetail,
}: {
  cell: Partial<Pick<Cell, 'generatedTxHash' | 'cellIndex' | 'targetBlockNumber'>>
  isDetail?: boolean
}) => {
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      <div className={styles.cellbasePanel}>
        <div className="cellbaseContent">Cellbase</div>
      </div>
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
    <div className={classNames(styles.cellbasePanel, isDetail && styles.isDetail)}>
      <CellInputIcon cell={cell} />
      <div className="cellbaseContent">Cellbase for Block</div>
      <Tooltip
        trigger={<img className="cellbaseHelpIcon" alt="cellbase help" src={HelpIcon} />}
        contentClassName={styles.tooltip}
        placement="top"
      >
        {tooltipContent}
      </Tooltip>
      <Link to={`/block/${cell.targetBlockNumber}`}>{localeNumberString(cell.targetBlockNumber)}</Link>
    </div>
  )
}

export default Cellbase

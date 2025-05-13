import { useQuery } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { explorerService } from '../../services/ExplorerService'
import { matchTxHash } from '../../utils/util'
import Loading from '../AwesomeLoadings/Spinner'
import HashTag from '../HashTag'
import { HelpTip } from '../HelpTip'
import styles from './index.module.scss'

const Field = ({
  title,
  tooltip,
  value,
  valueTooltip,
  linkUrl,
  tag,
}: Partial<Record<'title' | 'tooltip' | 'valueTooltip' | 'tag' | 'linkUrl', ReactNode>> & { value: ReactNode }) => (
  <div className={styles.field}>
    <div className={styles.title}>
      {title ? (
        <>
          <span>{title}</span>
          {tooltip && <HelpTip title={tooltip} />}
          <span>:</span>
        </>
      ) : (
        ''
      )}
    </div>
    <div className={styles.value}>
      <div className="">
        {linkUrl ? (
          <Link to={linkUrl} className="monospace">
            {value}
          </Link>
        ) : (
          value
        )}
        {valueTooltip && <HelpTip title={valueTooltip} />}
      </div>
      {tag && <div>{tag}</div>}
    </div>
  </div>
)

const TransactionParameters: FC<{ hash: string }> = ({ hash }) => {
  const [t] = useTranslation()

  const { data, isLoading } = useQuery(['explorer-tx', hash], () => explorerService.api.fetchTransactionByHash(hash))
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    )
  }

  if (!data) return <div>{`Transaction ${hash} not loaded`}</div>

  const { headerDeps, cellDeps, witnesses } = data

  const parameters = [
    {
      title: t('transaction.cell_deps'),
      tooltip: (
        <Trans
          i18nKey="glossary.cell_deps"
          components={{
            link1: (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
              <a
                href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#code-locating"
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      ),
      content: cellDeps.length ? (
        cellDeps.map(cellDep => {
          const {
            outPoint: { txHash, index },
            depType,
            script: { codeHash, hashType, name },
          } = cellDep
          const hashTag = matchTxHash(txHash, Number(index))
          return (
            <div className={styles.fieldSet} key={`${txHash}-${index}`}>
              <Field
                title={t('transaction.out_point_tx_hash')}
                tooltip={t('glossary.out_point_tx_hash')}
                value={txHash}
                linkUrl={`/transaction/${txHash}`}
                tag={
                  hashTag && (
                    <HashTag content={name} category={hashTag.category} script={{ codeHash, hashType, args: '' }} />
                  )
                }
              />
              <Field
                title={t('transaction.out_point_index')}
                tooltip={t('glossary.out_point_index')}
                value={Number(index)}
              />
              <Field
                title={t('transaction.dep_type')}
                tooltip={t('glossary.dep_type')}
                value={depType}
                valueTooltip={depType === 'dep_group' ? t('glossary.dep_group') : undefined}
              />
            </div>
          )
        })
      ) : (
        <div className={styles.fieldSet}>
          <Field title="CellDep" value="[ ]" />
        </div>
      ),
    },
    {
      title: t('transaction.header_deps'),
      tooltip: t('glossary.header_deps'),
      content: headerDeps.length ? (
        headerDeps.map(headerDep => (
          <div className={styles.fieldSet} key={headerDep}>
            <Field title={t('transaction.header_dep')} value={headerDep} linkUrl={`/block/${headerDep}`} />
          </div>
        ))
      ) : (
        <div className={styles.fieldSet}>
          <Field title={t('transaction.header_dep')} value="[ ]" />
        </div>
      ),
    },
    {
      title: t('transaction.witnesses'),
      tooltip: t('glossary.witnesses'),
      content: witnesses.length ? (
        witnesses.map((witness, index) => {
          const key = `${witness}-${index}`
          return (
            <div className={styles.fieldSet} key={key} data-is-decodable="true">
              <Field
                title="Witness"
                tooltip={t('glossary.witness')}
                value={<div className={classNames(styles.witnessInTransactionInfo, 'monospace')}>{witness}</div>}
              />
            </div>
          )
        })
      ) : (
        <div className={styles.fieldSet}>
          <Field title="Witness" tooltip={t('glossary.witness')} value="[ ]" />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {parameters.map(item => (
        <div className={styles.section} key={item.title}>
          <div className={styles.sectionTitle}>
            <span>{item.title}</span>
            {item.tooltip && <HelpTip title={item.tooltip} />}
          </div>
          <div className={styles.sectionValue}>{item.content}</div>
        </div>
      ))}
    </div>
  )
}

export default TransactionParameters

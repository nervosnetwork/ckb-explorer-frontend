import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shannonToCkb } from '../../../utils/util'
import Capacity from '../../../components/Capacity'
import { handleBigNumber } from '../../../utils/string'
import { CsvExport } from '../../../components/CsvExport'
import AddressText from '../../../components/AddressText'
import styles from './index.module.scss'
import { useIsMobile } from '../../../hooks'
import { NervosDaoDepositor } from '../../../services/ExplorerService'
import { CardCellFactory, CardListWithCellsList } from '../../../components/CardList'

type RankedDepositor = NervosDaoDepositor & { rank: number }

const AddressTextCol = ({ address }: { address: string }) => {
  return (
    <AddressText
      linkProps={{
        className: styles.addressTextCol,
        to: `/address/${address}`,
      }}
    >
      {address}
    </AddressText>
  )
}

const DepositorCardGroup: FC<{ depositors: RankedDepositor[] }> = ({ depositors }) => {
  const { t } = useTranslation()

  const items: CardCellFactory<RankedDepositor>[] = [
    {
      title: t('nervos_dao.dao_title_rank'),
      content: depositor => depositor.rank,
    },
    {
      title: t('nervos_dao.dao_title_address'),
      content: depositor => <AddressTextCol address={depositor.addressHash} />,
    },
    {
      title: t('nervos_dao.dao_title_deposit_capacity'),
      content: depositor => <Capacity capacity={shannonToCkb(depositor.daoDeposit)} layout="responsive" />,
    },
    {
      title: t('nervos_dao.dao_title_deposit_time'),
      content: depositor => handleBigNumber(depositor.averageDepositTime, 1),
    },
  ]

  return (
    <CardListWithCellsList
      className={styles.depositorCardGroup}
      dataSource={depositors}
      getDataKey={data => data.addressHash}
      cells={items}
      cardProps={{ rounded: false }}
    />
  )
}

export default ({ depositors, filter }: { depositors: NervosDaoDepositor[]; filter?: string }) => {
  const { t } = useTranslation()
  const rankedDepositors: RankedDepositor[] = depositors.map((depositor, index) => ({
    ...depositor,
    rank: index + 1,
  }))

  const filteredDepositors = filter ? rankedDepositors.filter(d => d.addressHash === filter) : rankedDepositors

  return useIsMobile() ? (
    <>
      <div className={styles.depositorRankCardPanel}>
        <DepositorCardGroup depositors={filteredDepositors} />
      </div>
      <div className={styles.depositorFooterPanel}>
        <div style={{ marginLeft: 'auto' }}>
          <CsvExport link="/nervosdao/depositor/export" />
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={styles.depositorRankPanel}>
        <div className={styles.depositorRankTitle}>
          <div>{t('nervos_dao.dao_title_rank')}</div>
          <div>{t('nervos_dao.dao_title_address')}</div>
          <div>{t('nervos_dao.dao_title_deposit_capacity')}</div>
          <div>{t('nervos_dao.dao_title_deposit_time')}</div>
        </div>
        <div className={styles.depositorSeparate} />
        {filteredDepositors.map(depositor => (
          <div className={styles.depositorRankItem} key={depositor.addressHash}>
            <div>{depositor.rank}</div>
            <AddressTextCol address={depositor.addressHash} />
            <div>
              <Capacity capacity={shannonToCkb(depositor.daoDeposit)} layout="responsive" />
            </div>
            <div>{handleBigNumber(depositor.averageDepositTime, 1)}</div>
          </div>
        ))}
      </div>
      <div className={styles.depositorFooterPanel}>
        <div style={{ marginLeft: 'auto' }}>
          <CsvExport link="/nervosdao/depositor/export" />
        </div>
      </div>
    </>
  )
}

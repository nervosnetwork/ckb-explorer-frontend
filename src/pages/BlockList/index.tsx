import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import { BlockListPanel, ContentTitle, ContentTable, BlocksPagition } from './styled'
import { parseSimpleDate } from '../../utils/date'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import BlockCard from '../../components/Card/BlockCard'
import BlockHeightIcon from '../../assets/block_height.png'
import TransactionIcon from '../../assets/transactions.png'
import BlockRewardIcon from '../../assets/block_reward_white.png'
import MinerIcon from '../../assets/miner.png'
import TimestampIcon from '../../assets/timestamp.png'
import { shannonToCkb } from '../../utils/util'
import { parsePageNumber } from '../../utils/string'
import { CachedKeys, BlockListPageParams } from '../../utils/const'
import { fetchCachedData } from '../../utils/cached'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { StateWithDispatch, PageActions } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'

export default ({
  dispatch,
  history: { replace, push },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const parsed = queryString.parse(search)
  const [t] = useTranslation()

  const page = parsePageNumber(parsed.page, BlockListPageParams.PageNo)
  const size = parsePageNumber(parsed.size, BlockListPageParams.PageSize)

  const { blockListState } = useContext(AppContext)

  useEffect(() => {
    const cachedBlocks = fetchCachedData<Response.Wrapper<State.Block>[]>(CachedKeys.BlockList)
    if (cachedBlocks) {
      dispatch({
        type: PageActions.UpdateBlockList,
        payload: {
          blocks: cachedBlocks,
        },
      })
    }
  }, [dispatch])

  useEffect(() => {
    if (size > BlockListPageParams.MaxPageSize) {
      replace(`/block/list?page=${page}&size=${BlockListPageParams.MaxPageSize}`)
    }
    const payload = {
      page,
      size,
      dispatch,
    }
    dispatch({
      type: PageActions.TriggerBlockList,
      payload: {
        ...payload,
      },
    })
  }, [replace, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    push(`/block/list?page=${pageNo}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockListPanel className="container">
        <ContentTitle>Blocks</ContentTitle>
        {isMobile() ? (
          <ContentTable>
            <div className="block__panel">
              {blockListState.blocks &&
                blockListState.blocks.map((block: any, index: number) => {
                  const key = index
                  return block && <BlockCard key={key} block={block.attributes} />
                })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              <TableTitleItem image={BlockHeightIcon} title={t('home.height')} />
              <TableTitleItem image={TransactionIcon} title={t('home.transactions')} />
              <TableTitleItem image={BlockRewardIcon} title={t('home.block_reward')} />
              <TableTitleItem image={MinerIcon} title={t('block.miner')} />
              <TableTitleItem image={TimestampIcon} title={t('home.time')} />
            </TableTitleRow>
            {blockListState.blocks &&
              blockListState.blocks.map((data: Response.Wrapper<State.Block>) => {
                return (
                  data && (
                    <TableContentRow key={data.attributes.block_hash}>
                      <TableContentItem
                        content={localeNumberString(data.attributes.number)}
                        to={`/block/${data.attributes.number}`}
                      />
                      <TableContentItem content={`${data.attributes.transactions_count}`} />
                      <TableContentItem content={`${localeNumberString(shannonToCkb(data.attributes.reward))}`} />
                      <TableMinerContentItem content={data.attributes.miner_hash} />
                      <TableContentItem content={parseSimpleDate(data.attributes.timestamp)} />
                    </TableContentRow>
                  )
                )
              })}
          </ContentTable>
        )}
        <BlocksPagition>
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultPageSize={size}
            pageSize={size}
            defaultCurrent={page}
            current={page}
            total={blockListState.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlocksPagition>
      </BlockListPanel>
    </Content>
  )
}

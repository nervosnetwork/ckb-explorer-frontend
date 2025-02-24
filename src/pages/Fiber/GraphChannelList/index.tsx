import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { Fiber } from '../../../services/ExplorerService'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import { useSearchParams } from '../../../hooks'
import { PAGE_SIZE } from '../../../constants/common'
import Content from '../../../components/Content'
import Pagination from '../Pagination'
import GraphChannelListComp from '../../../components/GraphChannelList'
import styles from './index.module.scss'
import { Response } from '../../../services/ExplorerService/types'

interface QueryResponse
  extends Response.Response<{
    fiberGraphChannels: Fiber.Graph.Channel[]
    meta: {
      total: number
      pageSize: number
    }
  }> {}

const GraphChannelList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()
  const { page = 1, page_size: pageSize = PAGE_SIZE } = useSearchParams('page', 'page_size')

  const { data } = useQuery({
    queryKey: ['fiber', 'graph', 'channels', +page, +pageSize] as const,
    queryFn: () => explorerService.api.getGraphChannels(+page, +pageSize),
  } satisfies UseQueryOptions<QueryResponse>)

  const channels = data?.data.fiberGraphChannels ?? []
  const { total = 1, pageSize: size = PAGE_SIZE } = data?.meta ?? {}
  const totalPages = Math.ceil(total / size)

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const { copyText } = target.dataset
    if (!copyText) return

    e.stopPropagation()
    e.preventDefault()

    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <h1 className={styles.header}>
          <span>{t('fiber.graph.channels.title', 'CKB Fiber Graph Channels')}</span>
        </h1>

        <div className={styles.channels}>
          <GraphChannelListComp list={channels} />

          <div className={styles.pagination}>
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphChannelList

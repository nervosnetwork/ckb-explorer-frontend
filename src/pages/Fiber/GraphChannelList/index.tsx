import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import styles from './index.module.scss'
import Pagination from '../Pagination'
import { PAGE_SIZE } from '../../../constants/common'
import GraphChannelListComp from '../../../components/GraphChannelList'
import { useSearchParams } from '../../../hooks'

const GraphChannelList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()
  const { page = 1, page_size: pageSize = PAGE_SIZE } = useSearchParams('page', 'page_size')

  const { data } = useQuery({
    queryKey: ['fiber', 'graph', 'channels', +page, +pageSize],
    queryFn: () => explorerService.api.getGraphChannels(+page, +pageSize),
  })

  const list = data?.data.fiberGraphChannels ?? []
  const pageInfo = data?.meta ?? { total: 1, pageSize: PAGE_SIZE }
  const totalPages = Math.ceil(pageInfo.total / pageInfo.pageSize)

  const handleCopy = (e: React.SyntheticEvent) => {
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { copyText } = elm.dataset
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <h1 className={styles.header}>
          <span>CKB Fiber Graph Channels</span>
        </h1>
        <div className={styles.channels}>
          <GraphChannelListComp list={list} />
          <div className={styles.pagination}>
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphChannelList

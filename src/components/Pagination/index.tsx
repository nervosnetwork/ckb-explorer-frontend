import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import LeftBlack from './pagination_black_left.png'
import RightBlack from './pagination_black_right.png'
import LeftGrey from './pagination_grey_left.png'
import RightGrey from './pagination_grey_right.png'
import { useIsMobile } from '../../hooks'
import SimpleButton from '../SimpleButton'
import { HelpTip } from '../HelpTip'
import styles from './index.module.scss'

const Pagination = ({
  currentPage,
  totalPages,
  gotoPage = currentPage === totalPages ? totalPages : currentPage + 1,
  onChange,
  className,
  annotation,
  pageSize,
  presetPageSizes,
}: {
  currentPage: number
  totalPages: number
  gotoPage?: number
  onChange: (page: number, size?: number) => void
  className?: string
  annotation?: string
  pageSize?: number
  presetPageSizes?: number[]
}) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const [inputPage, setInputPage] = useState(gotoPage)

  const total = Math.max(totalPages, 1)
  const current = Math.min(Math.max(currentPage, 1), totalPages)

  const mobilePagination = `${t('pagination.total_page')} ${total} ${t('pagination.end_page')}`
  const pcPagination = `${t('pagination.current_page')} ${current} ${t('pagination.of_page')} ${total} ${t(
    'pagination.end_page',
  )}`

  const annotationComp = annotation ? <HelpTip iconProps={{ alt: 'annotation' }}>{annotation}</HelpTip> : null

  const changePage = (page: number) => {
    if (page && page >= 1 && page <= total) {
      onChange(page)
      setInputPage(Math.min(page + 1, total))
    }
  }

  return (
    <div className={classNames(styles.paginationPanel, className)}>
      <div
        className={classNames(styles.paginationLeftItem, {
          isFirstPage: current === 1,
          isLastPage: current === total,
        })}
      >
        <SimpleButton
          className={classNames('paginationFirstButton', {
            isFirstPage: current === 1,
            isLastPage: current === total,
          })}
          onClick={() => changePage(1)}
        >
          {t('pagination.first')}
        </SimpleButton>
        <SimpleButton
          className={classNames('paginationLeftButton', {
            isFirstPage: current === 1,
            isLastPage: current === total,
          })}
          onClick={() => changePage(current - 1)}
        >
          <img src={current === 1 ? LeftGrey : LeftBlack} alt="left button" />
        </SimpleButton>

        {!isMobile && (
          <span className="paginationMiddleLabel">
            {pcPagination}
            {annotationComp}
          </span>
        )}
        <SimpleButton
          className={classNames('paginationRightButton', {
            isFirstPage: current === 1,
            isLastPage: current === total,
          })}
          onClick={() => changePage(current + 1)}
        >
          <img src={current === total ? RightGrey : RightBlack} alt="right button" />
        </SimpleButton>
        {isMobile && (
          <span className="paginationMiddleLabel">
            {mobilePagination}
            {annotationComp}
          </span>
        )}

        <SimpleButton
          className={classNames('paginationLastButton', {
            isFirstPage: current === 1,
            isLastPage: current === total,
          })}
          onClick={() => changePage(total)}
        >
          {t('pagination.last')}
        </SimpleButton>
        {presetPageSizes ? (
          <div className={styles.pageSizeSelector}>
            <span>{`${t('pagination.show_rows')}:`}</span>
            <div className={styles.pageSize}>{pageSize}</div>
            <div role="menu">
              {presetPageSizes.map(size => (
                <div
                  key={size}
                  role="menuitem"
                  tabIndex={0}
                  data-is-selected={size === pageSize}
                  onClick={() => onChange(current, size)}
                  onKeyDown={() => onChange(current, size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.paginationRightItem}>
        <span className="paginationPageLabel">{t('pagination.page')}</span>
        <input
          type="text"
          pattern="[0-9]*"
          className="paginationInputPage"
          value={inputPage}
          onChange={event => {
            const pageNo = parseInt(event.target.value, 10)
            setInputPage(Number.isNaN(pageNo) ? Number(event.target.value) : Math.min(pageNo, total))
          }}
          onKeyUp={event => {
            if (event.keyCode === 13) {
              changePage(inputPage)
            }
          }}
        />
        <SimpleButton className="paginationGotoPage" onClick={() => changePage(inputPage)}>
          {t('pagination.goto')}
        </SimpleButton>
      </div>
    </div>
  )
}

export default Pagination

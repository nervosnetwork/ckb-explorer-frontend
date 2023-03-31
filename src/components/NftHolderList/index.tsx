import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'
import { NftHolderSortByType } from '../../pages/NftCollectionInfo'

const primaryColor = getPrimaryColor()

const NftHolderList: React.FC<{
  list: Array<{ addr: string; quantity: number }>
  isLoading: boolean
  sortButton: (sortRule: NftHolderSortByType) => ReactNode
}> = ({ list, isLoading, sortButton }) => {
  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
            <th>{i18n.t('nft.holder')}</th>
            <th>
              {i18n.t('nft.quantity')} {sortButton('quantity')}
            </th>
          </tr>
        </thead>
        <tbody>
          {list.length ? (
            list.map(item => {
              return (
                <tr key={item.addr}>
                  <td>
                    <Tooltip title={item.addr}>
                      <Link
                        to={`/address/${item.addr}`}
                        style={{
                          color: primaryColor,
                        }}
                        className="monospace"
                      >
                        <span className={styles.addr}>{`${item.addr.slice(0, 25)}...${item.addr.slice(-25)}`}</span>
                        <span className={styles.addr}>{`${item.addr.slice(0, 12)}...${item.addr.slice(-12)}`}</span>
                      </Link>
                    </Tooltip>
                  </td>
                  <td>{item.quantity.toLocaleString('en')}</td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={2} className={styles.noRecord}>
                {isLoading ? i18n.t('nft.loading') : i18n.t(`nft.no_record`)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

NftHolderList.displayName = 'NftHolderList'

export default NftHolderList

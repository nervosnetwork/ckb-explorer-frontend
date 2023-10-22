import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPrimaryColor } from '../../constants/common'
import SortButton from '../SortButton'
import styles from './styles.module.scss'

export const primaryColor = getPrimaryColor()

const NftHolderList: React.FC<{
  list: Array<{ addr: string; quantity: number }>
  isLoading: boolean
}> = ({ list, isLoading }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
            <th>{t('nft.holder')}</th>
            <th>
              {t('nft.quantity')}
              <SortButton field="quantity" />
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
                {isLoading ? t('nft.loading') : t(`nft.no_record`)}
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

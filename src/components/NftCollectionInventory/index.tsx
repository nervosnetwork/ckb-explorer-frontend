import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'

const primaryColor = getPrimaryColor()

const NftCollectionInventory: React.FC<{
  list: Array<{
    icon_url: string | null
    id: number
    owner?: string
  }>
  isLoading: boolean
}> = ({ list, isLoading }) => {
  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
            <th>{i18n.t('nft.nft')}</th>
            <th>{i18n.t('nft.holder')}</th>
          </tr>
        </thead>
        <tbody>
          {list.length ? (
            list.map(item => {
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.item}>
                      {item.icon_url ? (
                        <img src={item.icon_url} alt="cover" loading="lazy" className={styles.icon} />
                      ) : (
                        <div className={styles.defaultIcon}>{item.id}</div>
                      )}
                      {`id: ${item.id}`}
                    </div>
                  </td>
                  <td>
                    {item.owner ? (
                      <Link
                        to={`/address/${item.owner}`}
                        style={{
                          color: primaryColor,
                          fontWeight: 700,
                        }}
                      >
                        <Tooltip title={item.owner}>{`${item.owner.slice(0, 8)}...${item.owner.slice(-8)}`}</Tooltip>
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={5} className={styles.noRecord}>
                {isLoading ? 'loading' : i18n.t(`nft.no_record`)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

NftCollectionInventory.displayName = 'NftCollectionInventory'

export default NftCollectionInventory

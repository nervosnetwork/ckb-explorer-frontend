import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import i18n from '../../utils/i18n'
import styles from './styles.module.scss'
import { getPrimaryColor } from '../../constants/common'

const primaryColor = getPrimaryColor()

const NftHolderList: React.FC<{ list: Array<{ addr: string; quantity: number }>; isLoading: boolean }> = ({
  list,
  isLoading,
}) => {
  return (
    <div className={styles.list}>
      <table>
        <thead>
          <tr>
            <th>{i18n.t('nft.holder')}</th>
            <th>{i18n.t('nft.quantity')}</th>
          </tr>
        </thead>
        <tbody>
          {list.length ? (
            list.map(item => {
              return (
                <tr key={item.addr}>
                  <td>
                    <Link
                      to={`/address/${item.addr}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      <Tooltip title={item.addr}>{`${item.addr.slice(0, 8)}...${item.addr.slice(-8)}`}</Tooltip>
                    </Link>
                  </td>
                  <td>{item.quantity.toLocaleString('en')}</td>
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

NftHolderList.displayName = 'NftHolderList'

export default NftHolderList

import { useTranslation } from 'react-i18next'
import { getPrimaryColor } from '../../../constants/common'
import SortButton from '../../../components/SortButton'
import styles from './styles.module.scss'
import AddressText from '../../../components/AddressText'

export const primaryColor = getPrimaryColor()

const NftHolderList: React.FC<{
  list: { addr: string; quantity: number }[]
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
                    <AddressText className={styles.addr}>{item.addr}</AddressText>
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

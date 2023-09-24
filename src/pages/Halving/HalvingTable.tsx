import i18n from '../../utils/i18n'
import { capitalizeFirstLetter } from '../../utils/string'
import styles from './index.module.scss'

export const HalvingTable = () => (
  <table className={styles.halvingTable}>
    <thead>
      <th>{i18n.t('halving.table_event')}</th>
      <th>{i18n.t('halving.table_date')}</th>
      <th>{i18n.t('halving.table_epoch_number')}</th>
      <th>{i18n.t('halving.table_epoch_reward')}</th>
      <th align="right">{i18n.t('halving.table_block_reward')}</th>
      <th align="right">{i18n.t('halving.table_daily_reward')}</th>
      <th align="right">{i18n.t('halving.table_total')}</th>
    </thead>
    <tbody>
      <tr>
        <td>{i18n.t('halving.table_launches')}</td>
        <td>16 Nov 2019</td>
        <td>0 ({i18n.t('halving.genesis_epoch')})</td>
        <td>1,917,808 CKB</td>
        <td align="right">1,065 CKB</td>
        <td align="right">11,506,849 CKB</td>
        <td align="right">16,800,000,000 CKB</td>
      </tr>
      <tr>
        <td>
          <strong>
            {capitalizeFirstLetter(i18n.t('ordinal.first'))}
            {i18n.t('symbol.char_space')}
            {i18n.t('halving.halving')}
          </strong>
        </td>
        <td>
          <strong>{i18n.t('halving.expected')} 19 Nov 2023</strong>
        </td>
        <td>
          <strong>8,760</strong>
        </td>
        <td>
          <strong>958,904 CKB</strong>
        </td>
        <td align="right">
          <strong>533 CKB</strong>
        </td>
        <td align="right">
          <strong>5,753,424 CKB</strong>
        </td>
        <td align="right">
          <strong>8,400,000,000 CKB</strong>
        </td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.second'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2027</td>
        <td>17,520</td>
        <td>479,452 CKB</td>
        <td align="right">266 CKB</td>
        <td align="right">2,876,712 CKB</td>
        <td align="right">4,200,000,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.3rd'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2031</td>
        <td>26,280</td>
        <td>239,726 CKB</td>
        <td align="right">133 CKB</td>
        <td align="right">1,438,356 CKB</td>
        <td align="right">2,100,000,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.4th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2035</td>
        <td>35,040</td>
        <td>119,863 CKB</td>
        <td align="right">67 CKB</td>
        <td align="right">719,178 CKB</td>
        <td align="right">1,050,000,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.5th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2039</td>
        <td>43,800</td>
        <td>59,932 CKB</td>
        <td align="right">33.5 CKB</td>
        <td align="right">359,589 CKB</td>
        <td align="right">525,000,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.6th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2043</td>
        <td>52,560</td>
        <td>29,966 CKB</td>
        <td align="right">16.75 CKB</td>
        <td align="right">179,794.5 CKB</td>
        <td align="right">262,500,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.7th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2047</td>
        <td>61,320</td>
        <td>14,983 CKB</td>
        <td align="right">8.375 CKB</td>
        <td align="right">89,897.25 CKB</td>
        <td align="right">131,250,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.8th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2051</td>
        <td>70,080</td>
        <td>7,491 CKB</td>
        <td align="right">4.1875 CKB</td>
        <td align="right">44,948.625 CKB</td>
        <td align="right">65,625,000 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.9th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2055</td>
        <td>78,840</td>
        <td>3,746 CKB</td>
        <td align="right">2.09375 CKB</td>
        <td align="right">22,474.3125 CKB</td>
        <td align="right">32,812,500 CKB</td>
      </tr>
      <tr>
        <td>
          {capitalizeFirstLetter(i18n.t('ordinal.10th'))}
          {i18n.t('symbol.char_space')}
          {i18n.t('halving.halving')}
        </td>
        <td>{i18n.t('halving.expected')} November 2059</td>
        <td>87,600</td>
        <td>1,873 CKB</td>
        <td align="right">1.046875 CKB</td>
        <td align="right">11,237.15625 CKB</td>
        <td align="right">16,406,250 CKB</td>
      </tr>
    </tbody>
  </table>
)

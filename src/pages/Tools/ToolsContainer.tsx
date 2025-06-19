import classNames from 'classnames'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import SimpleButton from '../../components/SimpleButton'
import Content from '../../components/Content'
import { Link } from '../../components/Link'
import styles from './styles.module.scss'
import Popover from '../../components/Popover'

const ToolsContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation()

  const MENU_ITEMS = [
    {
      label: t('tools.address_conversion'),
      url: '/tools/address-conversion',
    },
    {
      label: t('tools.hasher'),
      url: '/tools/hasher',
    },
    {
      label: t('tools.snake_case_and_camel_case'),
      url: '/tools/snake-case-and-camel-case',
    },
    {
      label: t('tools.broadcast_tx'),
      url: '/tools/broadcast-tx',
    },
    {
      label: t('tools.molecule_parser'),
      url: '/tools/molecule-parser',
    },
  ]

  return (
    <Content>
      <div className={classNames('container', styles.toolsContainer)}>
        <div className={styles.toolsSidebar}>
          {MENU_ITEMS.map(menu => (
            <Link key={menu.url} className={styles.siderCardItem} to={menu.url}>
              <div className={styles.siderCardTab}>{menu.label}</div>
            </Link>
          ))}
        </div>
        <div className={styles.toolsMain}>
          <div className={styles.toolMenuBar}>
            <Popover
              trigger={
                <SimpleButton className={styles.menuButton}>
                  {t('footer.tools')}
                  <ArrowIcon className={styles.icon} />
                </SimpleButton>
              }
            >
              {MENU_ITEMS.map(menu => ({
                key: menu.url,
                label: (
                  <Link key={menu.url} className={styles.link} to={menu.url ?? '/'}>
                    {menu.label}
                  </Link>
                ),
              })).map(item => {
                return <div key={item.key}>{item.label}</div>
              })}
            </Popover>
          </div>
          {children}
        </div>
      </div>
    </Content>
  )
}

export default ToolsContainer

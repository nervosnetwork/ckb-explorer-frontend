import { Link } from 'react-router-dom'
import { FC, memo, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'antd'
import classNames from 'classnames'
import { MobileMenuItem, MobileMenuLink, HeaderMenuPanel } from './styled'
import { isMainnet } from '../../../utils/chain'
import styles from './index.module.scss'
import { ReactComponent as ArrowIcon } from './arrow.svg'

export enum LinkType {
  Inner,
  Outer,
}

interface MenuData {
  type: LinkType
  name: string
  url?: string
  children?: MenuData[]
}

const useMenuDataList = () => {
  const { t } = useTranslation()
  const list: MenuData[] = [
    {
      type: LinkType.Inner,
      name: t('navbar.home'),
      url: '/',
    },
    {
      type: LinkType.Inner,
      name: t('navbar.nervos_dao'),
      url: '/nervosdao',
    },
    {
      type: LinkType.Inner,
      name: t('navbar.tokens'),
      children: [
        {
          type: LinkType.Inner,
          name: t('navbar.sUDT'),
          url: '/tokens',
        },
        {
          type: LinkType.Inner,
          name: t('navbar.inscriptions'),
          url: '/inscriptions',
        },
        {
          type: LinkType.Inner,
          name: t('navbar.nft_collections'),
          url: '/nft-collections',
        },
      ],
    },
    {
      type: LinkType.Inner,
      name: t('navbar.charts'),
      url: '/charts',
    },
    {
      type: LinkType.Inner,
      name: t('navbar.fee_rate'),
      url: '/fee-rate-tracker',
    },
  ]
  if (!isMainnet()) {
    list.push({
      type: LinkType.Outer,
      name: t('navbar.faucet'),
      url: 'https://faucet.nervos.org/',
    })
  }
  return list
}

const SubmenuDropdown: FC<PropsWithChildren<{ menu: MenuData }>> = ({ children, menu }) => {
  return (
    <Dropdown
      overlay={
        <div className={styles.submenu}>
          {menu.children?.map(menu => (
            <a
              key={menu.name}
              className={styles.link}
              href={menu.url}
              target={menu.type === LinkType.Inner ? '_self' : '_blank'}
              rel="noopener noreferrer"
            >
              {menu.name}
            </a>
          ))}
        </div>
      }
      mouseEnterDelay={0}
      transitionName=""
    >
      {children}
    </Dropdown>
  )
}

export default memo(({ isMobile }: { isMobile: boolean }) => {
  const menuList = useMenuDataList()

  return isMobile ? (
    <MobileMenuItem>
      {menuList
        .filter(menu => menu.name !== undefined)
        .map(menu =>
          menu.children ? (
            <SubmenuDropdown key={menu.name} menu={menu}>
              <MobileMenuLink className={styles.mobileSubmenuTrigger}>
                {menu.name}
                <ArrowIcon className={styles.icon} />
              </MobileMenuLink>
            </SubmenuDropdown>
          ) : (
            <MobileMenuLink
              key={menu.name}
              href={menu.url}
              target={menu.type === LinkType.Inner ? '_self' : '_blank'}
              rel="noopener noreferrer"
            >
              {menu.name}
            </MobileMenuLink>
          ),
        )}
    </MobileMenuItem>
  ) : (
    <HeaderMenuPanel>
      {menuList.map(menu =>
        // eslint-disable-next-line no-nested-ternary
        menu.children ? (
          <SubmenuDropdown key={menu.name} menu={menu}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={classNames('headerMenusItem', styles.submenuTrigger)}>
              {menu.name}
              <ArrowIcon className={styles.icon} />
            </a>
          </SubmenuDropdown>
        ) : menu.type === LinkType.Inner ? (
          <Link className="headerMenusItem" to={menu.url} key={menu.name}>
            {menu.name}
          </Link>
        ) : (
          <a className="headerMenusItem" href={menu.url} target="_blank" rel="noopener noreferrer" key={menu.name}>
            {menu.name}
          </a>
        ),
      )}
    </HeaderMenuPanel>
  )
})

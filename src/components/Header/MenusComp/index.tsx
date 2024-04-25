import { FC, memo, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'antd'
import classNames from 'classnames'
import { Link } from '../../Link'
import { MobileMenuItem, MobileMenuOuterLink, HeaderMenuPanel, MobileMenuInnerLink } from './styled'
import styles from './index.module.scss'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import { IS_MAINNET } from '../../../constants/common'

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
          name: t('navbar.xUDT'),
          url: '/xudts',
        },
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
      name: t('navbar.rgbpp'),
      url: '/rgbpp/transaction/list',
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
  if (!IS_MAINNET) {
    list.push({
      type: LinkType.Outer,
      name: t('navbar.faucet'),
      url: 'https://faucet.nervos.org/',
    })
  } else {
    list.splice(3, 1)
  }
  return list
}

const SubmenuDropdown: FC<PropsWithChildren<{ menu: MenuData }>> = ({ children, menu }) => {
  return (
    <Dropdown
      overlay={
        <div className={styles.submenu}>
          {menu.children?.map(menu =>
            menu.type === LinkType.Inner ? (
              <Link key={menu.name} className={styles.link} to={menu.url ?? '/'}>
                {menu.name}
              </Link>
            ) : (
              <a key={menu.name} className={styles.link} href={menu.url} target="_blank" rel="noopener noreferrer">
                {menu.name}
              </a>
            ),
          )}
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
          // eslint-disable-next-line no-nested-ternary
          menu.children ? (
            <SubmenuDropdown key={menu.name} menu={menu}>
              <MobileMenuOuterLink className={styles.mobileSubmenuTrigger}>
                {menu.name}
                <ArrowIcon className={styles.icon} />
              </MobileMenuOuterLink>
            </SubmenuDropdown>
          ) : menu.type === LinkType.Inner ? (
            <MobileMenuInnerLink key={menu.name} to={menu.url ?? '/'}>
              {menu.name}
            </MobileMenuInnerLink>
          ) : (
            <MobileMenuOuterLink key={menu.name} href={menu.url} target="_blank" rel="noopener noreferrer">
              {menu.name}
            </MobileMenuOuterLink>
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
          <Link className="headerMenusItem" to={menu.url ?? '/'} key={menu.name}>
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

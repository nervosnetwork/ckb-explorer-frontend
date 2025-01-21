/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, memo, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, DropdownProps } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { Link } from '../../Link'
import { MobileMenuItem, MobileMenuOuterLink, HeaderMenuPanel, MobileMenuInnerLink } from './styled'
import styles from './index.module.scss'
import { LanguageModal } from '../LanguageComp/LanguageModal'
import { CKBNodeModal } from '../CKBNodeComp/CKBNodeModal'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import { IS_MAINNET } from '../../../constants/common'
import { ReactComponent as MenuIcon } from './menu.svg'
import { ReactComponent as NewIcon } from './new.svg'
import { useCKBNode } from '../../../hooks/useCKBNode'
import { NervosDao, RGBPP, Faucet, Home, Charts, Assets, FeeRate } from './icons'

export enum LinkType {
  Inner,
  Outer,
}

interface MenuSeparator {
  type: 'separator'
}

interface MenuItemLabel {
  type: 'label'
  name: string
}

type Attr = 'inset' | 'new' | 'hot'

interface MenuData {
  type: LinkType
  name: string
  url?: string
  children?: (MenuItemLabel | MenuSeparator | MenuData)[]
  icon?: React.ReactElement
  attrs?: Attr[]
}

const useMenuDataList = () => {
  const { t } = useTranslation()
  const list: MenuData[] = [
    {
      type: LinkType.Inner,
      name: t('navbar.home'),
      url: '/',
      icon: <Home />,
    },
    {
      type: LinkType.Inner,
      name: t('navbar.nervos_dao'),
      url: '/nervosdao',
      icon: <NervosDao />,
    },
    {
      type: LinkType.Inner,
      name: t('navbar.charts'),
      url: '/charts',
      icon: <Charts />,
    },
    {
      type: LinkType.Inner,
      name: t('navbar.tokens'),
      icon: <Assets />,
      children: [
        { type: 'label', name: t('navbar.coins') },
        { type: 'separator' },
        {
          type: LinkType.Inner,
          name: t('navbar.xUDT'),
          url: '/xudts',
          attrs: ['inset', 'hot'],
        },
        {
          type: LinkType.Inner,
          name: t('navbar.sUDT'),
          url: '/tokens',
          attrs: ['inset'],
        },
        { type: 'separator' },
        {
          type: LinkType.Inner,
          name: t('navbar.inscriptions'),
          url: '/inscriptions',
        },
        { type: 'separator' },
        {
          type: LinkType.Inner,
          name: t('navbar.nft_collections'),
          url: '/nft-collections',
          attrs: ['hot'],
        },
      ],
    },
    {
      type: LinkType.Inner,
      name: t('navbar.rgbpp'),
      url: '/rgbpp/transaction/list',
      icon: <RGBPP />,
    },
    {
      type: LinkType.Inner,
      name: t('navbar.fee_rate'),
      url: '/fee-rate-tracker',
      icon: <FeeRate />,
    },
    ...(IS_MAINNET
      ? []
      : [
          {
            type: LinkType.Outer,
            name: t('navbar.faucet'),
            url: 'https://faucet.nervos.org/',
            icon: <Faucet />,
          },
        ]),
  ]
  return list
}

const SubmenuDropdown: FC<
  PropsWithChildren<DropdownProps & { menu: (MenuData | MenuItemLabel | MenuSeparator)[] }>
> = ({ children, menu, ...props }) => {
  return (
    <Dropdown
      overlay={
        <div className={styles.submenu}>
          {menu.map(menuItem => {
            switch (menuItem.type) {
              case 'separator':
                return <div key={Math.random()} className={styles.separator} />
              case 'label':
                return (
                  <div key={menuItem.name} className={styles.label}>
                    {menuItem.name}
                  </div>
                )
              case LinkType.Inner: {
                const isHot = menuItem.attrs?.includes('hot')
                const isInset = menuItem.attrs?.includes('inset')
                return (
                  <Link key={menuItem.name} className={styles.link} to={menuItem.url ?? '/'} data-is-inset={isInset}>
                    {menuItem.name}
                    {/* {isHot ? <Hot className={styles.hot} title="HOT" /> : null} */}
                    {isHot ? <img alt="hot" className={styles.hot} title="HOT" src="/images/Hot.gif" /> : null}
                  </Link>
                )
              }
              default: {
                return (
                  <a
                    key={menuItem.name}
                    className={styles.link}
                    href={menuItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {menuItem.name}
                  </a>
                )
              }
            }
          })}
        </div>
      }
      mouseEnterDelay={0}
      transitionName=""
      {...props}
    >
      {children}
    </Dropdown>
  )
}

export const MoreMenu = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { t } = useTranslation()
  const { isActivated } = useCKBNode()
  const [open, setOpen] = useState(false)
  const [languageModalVisible, setLanguageModalVisible] = useState(false)
  const [nodeModalVisible, setNodeModalVisible] = useState(false)

  const Wrapper = isMobile ? MobileMenuItem : ({ children }: PropsWithChildren<{}>) => <>{children}</>

  return (
    <Wrapper>
      <Dropdown
        onOpenChange={setOpen}
        open={open}
        overlay={
          <div className={styles.submenu}>
            <Link className={styles.link} to="/tools/address-conversion">
              {t('footer.tools')}
            </Link>
            <span
              className={classNames(styles.link, styles.clickable)}
              onClick={() => {
                setOpen(false)
                setLanguageModalVisible(true)
              }}
            >
              {t('navbar.language')}
            </span>
            <span
              className={classNames(styles.link, styles.clickable, styles.linkWithBadge)}
              onClick={() => {
                setOpen(false)
                setNodeModalVisible(true)
              }}
            >
              {t('navbar.node')}
              <span className={classNames(styles.nodeStatus, { [styles.activate]: isActivated })} />
            </span>
          </div>
        }
        mouseEnterDelay={0}
        transitionName=""
        placement="bottomRight"
      >
        {isMobile ? (
          <MobileMenuOuterLink className={styles.mobileSubmenuTrigger}>
            {t('navbar.more')}
            <ArrowIcon className={styles.icon} />
          </MobileMenuOuterLink>
        ) : (
          <span
            className={classNames(styles.clickable, styles.headerMenusItem, styles.submenuTrigger, styles.moreMenus)}
          >
            <MenuIcon className={styles.moreIcon} />
            {/* TODO: remove this after 2024-08-01 */}
            {dayjs().isBefore(dayjs('2024-08-01')) && <NewIcon className={styles.newIcon} />}
          </span>
        )}
      </Dropdown>
      {languageModalVisible ? <LanguageModal onClose={() => setLanguageModalVisible(false)} /> : null}
      {nodeModalVisible ? <CKBNodeModal onClose={() => setNodeModalVisible(false)} /> : null}
    </Wrapper>
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
            <SubmenuDropdown key={menu.name} menu={menu.children}>
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
      {menuList.map(menu => {
        if (menu.children) {
          return (
            <SubmenuDropdown key={menu.name} menu={menu.children}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className={classNames(styles.headerMenusItem, styles.submenuTrigger)} title={menu.name}>
                {menu.icon}
                <ArrowIcon className={styles.icon} />
              </a>
            </SubmenuDropdown>
          )
        }

        if (menu.type === LinkType.Inner) {
          return (
            <Link className={styles.headerMenusItem} to={menu.url ?? '/'} key={menu.name} title={menu.name}>
              {menu.icon}
            </Link>
          )
        }
        return (
          <a
            className={styles.headerMenusItem}
            href={menu.url}
            target="_blank"
            rel="noopener noreferrer"
            key={menu.name}
            title={menu.name}
          >
            {menu.icon}
          </a>
        )
      })}
    </HeaderMenuPanel>
  )
})

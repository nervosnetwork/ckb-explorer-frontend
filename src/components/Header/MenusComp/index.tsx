/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, memo, PropsWithChildren, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { NervosDao, RGBPP, Faucet, Home, Charts, Assets, FeeRate, Fiber } from './icons'
import NewBadge from './NewBadge'
import Popover from '../../Popover'

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

type Attr = 'inset' | 'new' | 'hot' | 'hidden'

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
  const FiberMenuItem: MenuData = {
    type: LinkType.Inner,
    name: t('navbar.fiber_network'),
    icon: <Fiber />,
    attrs: ['new', 'hidden'],
    children: [
      {
        type: LinkType.Inner,
        name: t('navbar.fiber_statistics'),
        url: '/fiber/statistics',
      },
      {
        type: LinkType.Inner,
        name: t('navbar.fiber_graph_nodes'),
        url: '/fiber/graph/nodes',
      },
    ],
  }

  const FaucetMenuItem = {
    type: LinkType.Outer,
    name: t('navbar.faucet'),
    url: 'https://faucet.nervos.org/',
    icon: <Faucet />,
  }

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
        { type: LinkType.Inner, name: t('navbar.coins'), url: '/udts', attrs: [] },
        { type: 'separator' },
        {
          type: LinkType.Inner,
          name: t('navbar.xUDT'),
          url: '/xudts',
          attrs: ['inset'],
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
          attrs: [],
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
    ...(IS_MAINNET ? [] : [FiberMenuItem, FaucetMenuItem]),
  ]
  return list
}

const SubmenuDropdown: FC<
  PropsWithChildren<{ menu: (MenuData | MenuItemLabel | MenuSeparator)[]; isMobile?: boolean }>
> = ({ children, menu, isMobile, ...props }) => {
  const portalContainer = useRef<HTMLDivElement>(null)

  return (
    <Popover
      {...props}
      trigger={children}
      showArrow={false}
      contentStyle={{
        padding: 0,
        fontSize: 14,
        width: isMobile ? 'var(--radix-popper-anchor-width)' : 'auto',
      }}
      portalContainer={portalContainer.current}
    >
      <div className={styles.submenu} ref={portalContainer}>
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
    </Popover>
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
      <Popover
        onOpenChange={setOpen}
        open={open}
        showArrow={false}
        trigger={
          isMobile ? (
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
          )
        }
      >
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
      </Popover>
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
        .map(menu => {
          const isHidden = menu.attrs?.includes('hidden')
          if (isHidden) return null
          const isNew = menu.attrs?.includes('new')
          if (menu.children) {
            return (
              <SubmenuDropdown key={menu.name} menu={menu.children} isMobile={isMobile}>
                <MobileMenuOuterLink className={styles.mobileSubmenuTrigger}>
                  {menu.icon}
                  {menu.name}
                  {isNew ? <NewBadge /> : null}
                  <ArrowIcon className={styles.icon} />
                </MobileMenuOuterLink>
              </SubmenuDropdown>
            )
          }

          if (menu.type === LinkType.Inner) {
            return (
              <MobileMenuInnerLink key={menu.name} to={menu.url ?? '/'}>
                {menu.icon}
                {menu.name}
                {isNew ? <NewBadge /> : null}
              </MobileMenuInnerLink>
            )
          }
          if (menu.type === LinkType.Outer) {
            return (
              <MobileMenuOuterLink key={menu.name} href={menu.url} target="_blank" rel="noopener noreferrer">
                {menu.icon}
                {menu.name}
                {isNew ? <NewBadge /> : null}
              </MobileMenuOuterLink>
            )
          }
          return null
        })}
    </MobileMenuItem>
  ) : (
    <HeaderMenuPanel>
      {menuList.map(menu => {
        const isHidden = menu.attrs?.includes('hidden')
        if (isHidden) return null
        const isNew = menu.attrs?.includes('new')
        if (menu.children) {
          return (
            <SubmenuDropdown key={menu.name} menu={menu.children}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className={classNames(styles.headerMenusItem, styles.submenuTrigger)} title={menu.name}>
                {menu.icon}
                <ArrowIcon className={styles.icon} />
                {isNew ? <NewBadge /> : null}
              </a>
            </SubmenuDropdown>
          )
        }

        if (menu.type === LinkType.Inner) {
          return (
            <Link
              className={styles.headerMenusItem}
              to={menu.url ?? '/'}
              key={menu.name}
              title={menu.name}
              data-popup={menu.name}
            >
              {menu.icon}
              {isNew ? <NewBadge /> : null}
            </Link>
          )
        }
        if (menu.type === LinkType.Outer) {
          return (
            <a
              className={styles.headerMenusItem}
              href={menu.url}
              target="_blank"
              rel="noopener noreferrer"
              key={menu.name}
              title={menu.name}
              data-popup={menu.name}
            >
              {menu.icon}
              {isNew ? <NewBadge /> : null}
            </a>
          )
        }
        return null
      })}
    </HeaderMenuPanel>
  )
})

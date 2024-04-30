/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, memo, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, DropdownProps } from 'antd'
import classNames from 'classnames'
import { Link } from '../../Link'
import { MobileMenuItem, MobileMenuOuterLink, HeaderMenuPanel, MobileMenuInnerLink } from './styled'
import styles from './index.module.scss'
import { LanguageModal } from '../LanguageComp/LanguageModal'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import { IS_MAINNET } from '../../../constants/common'
import { ReactComponent as MenuIcon } from './menu.svg'

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
    ...(IS_MAINNET
      ? [
          {
            type: LinkType.Outer,
            name: t('navbar.faucet'),
            url: 'https://faucet.nervos.org/',
          },
        ]
      : []),
  ]
  if (!IS_MAINNET) {
    list.push({
      type: LinkType.Outer,
      name: t('navbar.faucet'),
      url: 'https://faucet.nervos.org/',
    })
  }
  return list
}

const SubmenuDropdown: FC<PropsWithChildren<DropdownProps & { menu: MenuData[] }>> = ({ children, menu, ...props }) => {
  return (
    <Dropdown
      overlay={
        <div className={styles.submenu}>
          {menu.map(menu =>
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
      {...props}
    >
      {children}
    </Dropdown>
  )
}

export const MoreMenu = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [languageModalVisible, setLanguageModalVisible] = useState(false)

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
            <a
              className={styles.link}
              onClick={() => {
                setOpen(false)
                setLanguageModalVisible(true)
              }}
            >
              {t('navbar.language')}
            </a>
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
          <a className={classNames(styles.headerMenusItem, styles.submenuTrigger, styles.moreMenus)}>
            <MenuIcon className={styles.moreIcon} />
          </a>
        )}
      </Dropdown>
      {languageModalVisible ? <LanguageModal onClose={() => setLanguageModalVisible(false)} /> : null}
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
      {menuList.map(menu =>
        // eslint-disable-next-line no-nested-ternary
        menu.children ? (
          <SubmenuDropdown key={menu.name} menu={menu.children}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={classNames(styles.headerMenusItem, styles.submenuTrigger)}>
              {menu.name}
              <ArrowIcon className={styles.icon} />
            </a>
          </SubmenuDropdown>
        ) : menu.type === LinkType.Inner ? (
          <Link className={styles.headerMenusItem} to={menu.url ?? '/'} key={menu.name}>
            {menu.name}
          </Link>
        ) : (
          <a
            className={styles.headerMenusItem}
            href={menu.url}
            target="_blank"
            rel="noopener noreferrer"
            key={menu.name}
          >
            {menu.name}
          </a>
        ),
      )}
    </HeaderMenuPanel>
  )
})

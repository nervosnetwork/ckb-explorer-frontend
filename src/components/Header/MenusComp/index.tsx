import React from 'react'
import { isMobile } from '../../../utils/screen'
import i18n from '../../../utils/i18n'
import { MobileMenuItem, MobileMenuLink } from './styled'
import { Link } from 'react-router-dom'
import { HeaderMenuPanel } from './styled'
import { isMainnet } from '../../../utils/chain'
import CONFIG from '../../../config'

export enum LinkType {
  Inner,
  Outer,
}

const menuDataList = () => {
  return [
    {
      type: LinkType.Inner,
      name: i18n.t('navbar.home'),
      url: '/',
    },
    {
      type: LinkType.Inner,
      name: i18n.t('navbar.nervos_dao'),
      url: '/nervosdao',
    },
    {
      type: LinkType.Inner,
      name: i18n.t('navbar.tokens'),
      url: '/tokens',
    },
    {
      type: LinkType.Inner,
      name: i18n.t('navbar.charts'),
      url: '/charts',
    },
    !isMainnet()
      ? {
          type: LinkType.Outer,
          name: i18n.t('navbar.faucet'),
          url: 'https://faucet.nervos.org/',
        }
      : {},
  ]
}

const urlPrefix = isMainnet() ? '' : `/${CONFIG.TESTNET_NAME}`
const MenuItemLink = ({ menu }: { menu: any }) => {
  const { url, type, name } = menu
  return (
    <MobileMenuLink
      href={type === LinkType.Inner ? `${urlPrefix}${url}` : url}
      target={type === LinkType.Inner ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {name}
    </MobileMenuLink>
  )
}

export default () => {
  return isMobile() ? (
    <MobileMenuItem>
      {menuDataList()
        .filter(menu => menu.name !== undefined)
        .map(menu => {
          return <MenuItemLink menu={menu} key={menu.name} />
        })}
    </MobileMenuItem>
  ) : (
    <HeaderMenuPanel>
      {menuDataList()
        .filter(menu => menu.name !== undefined)
        .map(menu => {
          return menu.type === LinkType.Inner ? (
            <Link className="header__menus__item" to={menu.url} key={menu.name}>
              {menu.name}
            </Link>
          ) : (
            <a
              className="header__menus__item"
              href={menu.url}
              target="_blank"
              rel="noopener noreferrer"
              key={menu.name}
            >
              {menu.name}
            </a>
          )
        })}
    </HeaderMenuPanel>
  )
}

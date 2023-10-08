import { Link } from 'react-router-dom'
import { memo } from 'react'
import { useIsMobile } from '../../../utils/hook'
import i18n from '../../../utils/i18n'
import { MobileMenuItem, MobileMenuLink, HeaderMenuPanel } from './styled'
import { isMainnet } from '../../../utils/chain'

export enum LinkType {
  Inner,
  Outer,
}

const menuDataList = () => [
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
    name: i18n.t('navbar.nft_collections'),
    url: '/nft-collections',
  },
  {
    type: LinkType.Inner,
    name: i18n.t('navbar.charts'),
    url: '/charts',
  },
  {
    type: LinkType.Inner,
    name: i18n.t('navbar.fee_rate'),
    url: '/fee-rate-tracker',
  },
  !isMainnet()
    ? {
        type: LinkType.Outer,
        name: i18n.t('navbar.faucet'),
        url: 'https://faucet.nervos.org/',
      }
    : {},
]

const MenuItemLink = ({ menu }: { menu: any }) => {
  const { url, type, name } = menu
  return (
    <MobileMenuLink href={url} target={type === LinkType.Inner ? '_self' : '_blank'} rel="noopener noreferrer">
      {name}
    </MobileMenuLink>
  )
}

export default memo(() =>
  useIsMobile() ? (
    <MobileMenuItem>
      {menuDataList()
        .filter(menu => menu.name !== undefined)
        .map(menu => (
          <MenuItemLink menu={menu} key={menu.name} />
        ))}
    </MobileMenuItem>
  ) : (
    <HeaderMenuPanel>
      {menuDataList()
        .filter(menu => menu.name !== undefined)
        .map(menu =>
          menu.type === LinkType.Inner ? (
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
  ),
)

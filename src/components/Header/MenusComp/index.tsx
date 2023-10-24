import { Link } from 'react-router-dom'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../../utils/hook'
import { MobileMenuItem, MobileMenuLink, HeaderMenuPanel } from './styled'
import { isMainnet } from '../../../utils/chain'

export enum LinkType {
  Inner,
  Outer,
}

interface MenuData {
  type: LinkType
  name: string
  url: string
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
      url: '/tokens',
    },
    {
      type: LinkType.Inner,
      name: t('navbar.nft_collections'),
      url: '/nft-collections',
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

const MenuItemLink = ({ menu }: { menu: MenuData }) => {
  const { url, type, name } = menu
  return (
    <MobileMenuLink href={url} target={type === LinkType.Inner ? '_self' : '_blank'} rel="noopener noreferrer">
      {name}
    </MobileMenuLink>
  )
}

export default memo(() => {
  const menuList = useMenuDataList()
  return useIsMobile() ? (
    <MobileMenuItem>
      {menuList
        .filter(menu => menu.name !== undefined)
        .map(menu => (
          <MenuItemLink menu={menu} key={menu.name} />
        ))}
    </MobileMenuItem>
  ) : (
    <HeaderMenuPanel>
      {menuList.map(menu =>
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
  )
})

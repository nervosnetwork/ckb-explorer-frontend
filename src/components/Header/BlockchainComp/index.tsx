import { useState, useLayoutEffect, FC, memo } from 'react'
import { useQuery } from 'react-query'
import { isMainnet } from '../../../utils/chain'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import BlueDropUpIcon from '../../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../../assets/green_drop_up.png'
import { HeaderBlockchainPanel, MobileSubMenuPanel } from './styled'
import SimpleButton from '../../SimpleButton'
import ChainDropdown from '../../Dropdown/ChainType'
import { useIsMobile } from '../../../utils/hook'
import { ChainName, MAINNET_URL, TESTNET_URL } from '../../../constants/common'
import { explorerService } from '../../../services/ExplorerService'
import { AppCachedKeys } from '../../../constants/cache'
import { fetchCachedData, storeCachedData } from '../../../utils/cache'

const getDropdownIcon = (showDropdown: boolean) => {
  if (!showDropdown) return WhiteDropdownIcon
  return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
}

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.indexOf('(') !== -1) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf('('))}`
  }
  return nodeVersion
}

const BlockchainDropdown: FC<{ nodeVersion: string }> = ({ nodeVersion }) => {
  const [showChainType, setShowChainType] = useState(false)
  const [chainTypeLeft, setChainTypeLeft] = useState(0)
  const [chainTypeTop, setChainTypeTop] = useState(0)

  useLayoutEffect(() => {
    if (showChainType) {
      const chainDropdownComp = document.getElementById('header__blockchain__panel')
      if (chainDropdownComp) {
        const chainDropdownReact = chainDropdownComp.getBoundingClientRect()
        if (chainDropdownReact) {
          setChainTypeLeft(chainDropdownReact.left - (isMainnet() ? 40 : 30))
          setChainTypeTop(chainDropdownReact.bottom - 6)
        }
      }
    }
  }, [showChainType])
  return (
    <HeaderBlockchainPanel
      id="header__blockchain__panel"
      onMouseLeave={() => {
        setShowChainType(false)
      }}
    >
      <SimpleButton
        className="headerBlockchainFlag"
        onMouseOver={() => {
          setShowChainType(true)
        }}
      >
        <div className="headerBlockchainContentPanel">
          <div
            className="headerBlockchainContent"
            style={{
              textTransform: 'uppercase',
            }}
          >
            {isMainnet() ? ChainName.Mainnet : ChainName.Testnet}
          </div>
          <img src={getDropdownIcon(showChainType)} alt="dropdown icon" />
        </div>
        <div className="headerBlockchainNodeVersion">{handleVersion(nodeVersion)}</div>
      </SimpleButton>
      {showChainType && <ChainDropdown setShow={setShowChainType} left={chainTypeLeft} top={chainTypeTop} />}
    </HeaderBlockchainPanel>
  )
}

const BlockchainMenu: FC<{ nodeVersion: string }> = ({ nodeVersion }) => {
  const [showSubMenu, setShowSubMenu] = useState(false)

  const chainTypeIcon = () => {
    if (!showSubMenu) {
      return WhiteDropdownIcon
    }
    return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
  }

  return (
    <MobileSubMenuPanel showSubMenu={false}>
      <SimpleButton
        className="mobileMenusMainItem"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div
          className="mobileMenusMainItemContentHighlight"
          style={{
            textTransform: 'uppercase',
          }}
        >
          {isMainnet() ? ChainName.Mainnet : ChainName.Testnet}
        </div>
        <img className="mobileMenusMainItemIcon" alt="mobile chain type icon" src={chainTypeIcon()} />
      </SimpleButton>
      <div className="blockchainMobileNodeVersion">{handleVersion(nodeVersion)}</div>
      {showSubMenu && (
        <>
          <a className="mobileMenusSubItem" href={MAINNET_URL}>
            {`${ChainName.Mainnet} mainnet`}
          </a>
          <a className="mobileMenusSubItem" href={TESTNET_URL}>
            {`${ChainName.Testnet} testnet`}
          </a>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

export default memo(() => {
  const isMobile = useIsMobile()

  const query = useQuery(
    ['node_version'],
    async () => {
      const { version } = await explorerService.api.fetchNodeVersion()
      storeCachedData(AppCachedKeys.Version, `${version}&${new Date().getTime()}`)
      return version
    },
    {
      keepPreviousData: true,
      initialData: () => {
        // version cache format: version&timestamp
        const data = fetchCachedData<string>(AppCachedKeys.Version)
        if (!data?.includes('&')) return undefined

        const timestamp = Number(data.substring(data.indexOf('&') + 1))
        const DAY_TIMESTAMP = 24 * 60 * 60 * 1000
        const isStale = Date.now() - timestamp > DAY_TIMESTAMP
        if (isStale) return undefined

        const nodeVersion = data.substring(0, data.indexOf('&'))
        return nodeVersion
      },
    },
  )
  const nodeVersion = query.data ?? ''

  return isMobile ? <BlockchainMenu nodeVersion={nodeVersion} /> : <BlockchainDropdown nodeVersion={nodeVersion} />
})

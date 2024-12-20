import { useState, useLayoutEffect, FC, memo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isMainnet } from '../../../utils/chain'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import BlueDropUpIcon from '../../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../../assets/green_drop_up.png'
import { HeaderBlockchainPanel, MobileSubMenuPanel } from './styled'
import SimpleButton from '../../SimpleButton'
import ChainDropdown from '../../Dropdown/ChainType'
import { ChainName, MAINNET_URL, ONE_DAY_MILLISECOND, TESTNET_URL } from '../../../constants/common'
import { explorerService } from '../../../services/ExplorerService'
import { cacheService } from '../../../services/CacheService'
import { useChainName } from '../../../hooks/useCKBNode'

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

  const chainName = useChainName()

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
            {chainName}
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

  const chainName = useChainName()

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
          {chainName}
        </div>
        <img className="mobileMenusMainItemIcon" alt="mobile chain type icon" src={chainTypeIcon()} />
      </SimpleButton>
      <div className="blockchainMobileNodeVersion">{handleVersion(nodeVersion)}</div>
      {showSubMenu && (
        <>
          <a className="mobileMenusSubItem" href={MAINNET_URL}>
            {`${ChainName.Mainnet} Mainnet`}
          </a>
          <a className="mobileMenusSubItem" href={TESTNET_URL}>
            {`${ChainName.Testnet} Testnet`}
          </a>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

export default memo(({ isMobile }: { isMobile: boolean }) => {
  const query = useQuery(
    ['node_version'],
    async () => {
      const { version } = await explorerService.api.fetchNodeVersion()
      cacheService.set<string>('node_version', version, { expireTime: ONE_DAY_MILLISECOND })
      return version
    },
    {
      keepPreviousData: true,
      initialData: () => cacheService.get<string>('node_version'),
    },
  )
  const nodeVersion = query.data ?? ''

  return isMobile ? <BlockchainMenu nodeVersion={nodeVersion} /> : <BlockchainDropdown nodeVersion={nodeVersion} />
})

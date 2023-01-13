import { useState, useLayoutEffect } from 'react'
import { isMainnet } from '../../../utils/chain'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import BlueDropUpIcon from '../../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../../assets/green_drop_up.png'
import { useAppState } from '../../../contexts/providers'
import { HeaderBlockchainPanel, MobileSubMenuPanel } from './styled'
import SimpleButton from '../../SimpleButton'
import ChainDropdown from '../../Dropdown/ChainType'
import { useIsMobile } from '../../../utils/hook'
import { ChainName, MAINNET_URL, TESTNET_URL } from '../../../constants/common'

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

const BlockchainDropdown = () => {
  const {
    app: { nodeVersion, language },
  } = useAppState()
  const [showChainType, setShowChainType] = useState(false)
  const [chainTypeLeft, setChainTypeLeft] = useState(0)
  const [chainTypeTop, setChainTypeTop] = useState(0)

  useLayoutEffect(() => {
    if (showChainType && language) {
      const chainDropdownComp = document.getElementById('header__blockchain__panel')
      if (chainDropdownComp) {
        const chainDropdownReact = chainDropdownComp.getBoundingClientRect()
        if (chainDropdownReact) {
          setChainTypeLeft(chainDropdownReact.left - (isMainnet() ? 40 : 30))
          setChainTypeTop(chainDropdownReact.bottom - 6)
        }
      }
    }
  }, [showChainType, language])
  return (
    <HeaderBlockchainPanel
      id="header__blockchain__panel"
      onMouseLeave={() => {
        setShowChainType(false)
      }}
    >
      <SimpleButton
        className="header__blockchain__flag"
        onMouseOver={() => {
          setShowChainType(true)
        }}
      >
        <div className="header__blockchain__content_panel">
          <div
            className="header__blockchain__content"
            style={{
              textTransform: 'uppercase',
            }}
          >
            {isMainnet() ? ChainName.Mainnet : ChainName.Testnet}
          </div>
          <img src={getDropdownIcon(showChainType)} alt="dropdown icon" />
        </div>
        <div className="header__blockchain__node__version">{handleVersion(nodeVersion)}</div>
      </SimpleButton>
      {showChainType && <ChainDropdown setShow={setShowChainType} left={chainTypeLeft} top={chainTypeTop} />}
    </HeaderBlockchainPanel>
  )
}

const BlockchainMenu = () => {
  const {
    app: { nodeVersion },
  } = useAppState()
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
        className="mobile__menus__main__item"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div
          className="mobile__menus__main__item__content__highlight"
          style={{
            textTransform: 'uppercase',
          }}
        >
          {isMainnet() ? ChainName.Mainnet : ChainName.Testnet}
        </div>
        <img className="mobile__menus__main__item__icon" alt="mobile chain type icon" src={chainTypeIcon()} />
      </SimpleButton>
      <div className="blockchain__mobile__node__version">{handleVersion(nodeVersion)}</div>
      {showSubMenu && (
        <>
          <a className="mobile__menus__sub__item" href={MAINNET_URL}>
            {`${ChainName.Mainnet} mainnet`}
          </a>
          <a className="mobile__menus__sub__item" href={TESTNET_URL}>
            {`${ChainName.Testnet} testnet`}
          </a>
        </>
      )}
    </MobileSubMenuPanel>
  )
}

export default () => (useIsMobile() ? <BlockchainMenu /> : <BlockchainDropdown />)

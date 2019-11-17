import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'
import CONFIG from '../../config'
import { isMainnet } from '../../utils/chain'

export const ChainTypePanel = styled.div`
  width: 150px;
  height: 89px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  left: ${(props: { left: number }) => props.left}px;
  top: 70px;

  .chain_type_selected {
    width: 100%;
    font-size: 14px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    color: ${props => props.theme.primary};

    a {
      color: ${props => props.theme.primary};
    }

    a:hover {
      color: ${props => props.theme.primary};
    }
  }
  .chain_type_normal {
    width: 100%;
    font-size: 14px;
    height: 44px;
    cursor: pointer;
    line-height: 44px;
    text-align: center;
    font-weight: bold;
    color: #676767;

    a {
      color: #676767;
    }
    a:hover {
      color: #676767;
    }
  }
  .chain_type_separate {
    width: 100%;
    height: 1px;
    background: #f2f2f2;
  }

  @media (max-width: 700px) {
    width: 96px;
    height: 75px;
    top: 35px;

    .chain_type_selected {
      font-size: 10px;
      height: 37px;
      line-height: 37px;
    }
    .chain_type_normal {
      font-size: 10px;
      height: 37px;
      line-height: 37px;
    }
  }
`

const parseTestnetName = (name: string) => {
  if (!name) return ''
  return `${name.substring(0, 1).toUpperCase()}${name.substring(1)}`
}

export default ({ setShowChainDropdown, left }: { setShowChainDropdown: Function; left: number }) => {
  const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`
  return (
    <ChainTypePanel
      left={left}
      onMouseLeave={() => {
        setShowChainDropdown(false)
      }}
    >
      <div
        className={`chain_type_${isMainnet() ? 'selected' : 'normal'}`}
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowChainDropdown(false)
        }}
      >
        <a href={CONFIG.MAINNET_URL}>{i18n.t('blockchain.mainnet')}</a>
      </div>
      <div className="chain_type_separate" />
      <div
        className={`chain_type_${!isMainnet() ? 'selected' : 'normal'}`}
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowChainDropdown(false)
        }}
      >
        <a href={testnetUrl}>{`${parseTestnetName(CONFIG.TESTNET_NAME)} ${i18n.t('blockchain.testnet')}`}</a>
      </div>
    </ChainTypePanel>
  )
}

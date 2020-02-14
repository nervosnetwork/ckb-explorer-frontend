import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'
import CONFIG from '../../config'
import { isMainnet } from '../../utils/chain'

export const ChainTypePanel = styled.div`
  width: 130px;
  height: 74px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  color: #000000;

  a {
    color: #000000;
    text-transform: capitalize;
  }
  a:hover {
    color: #000000;
  }

  left: ${(props: { left: number; top: number }) => props.left}px;
  top: ${(props: { left: number; top: number }) => props.top}px;

  .chain_type_selected {
    width: 94%;
    font-size: 14px;
    height: 33px;
    line-height: 33px;
    margin: 3px 3% 0 3%;
    padding: 0 3%;
    cursor: pointer;
    border-radius: 3px;
    white-space: nowrap;
    &:hover {
      background: #f1f1f1;
    }
  }
  .chain_type_normal {
    width: 94%;
    font-size: 14px;
    height: 33px;
    line-height: 33px;
    margin: 0px 3% 3px 3%;
    padding: 0 3%;
    cursor: pointer;
    border-radius: 3px;

    &:hover {
      background: #f1f1f1;
    }
  }

  .chain_type_separate {
    width: 88%;
    height: 0.5px;
    border: solid 0.5px #c3c3c3;
    margin: 0 6%;
  }

  @media (max-width: 700px) {
    width: 80px;
    height: 65px;
    top: 35px;

    .chain_type_selected {
      font-size: 10px;
      height: 32px;
      line-height: 32px;
    }
    .chain_type_normal {
      font-size: 10px;
      height: 32px;
      line-height: 32px;
    }
  }
`

export default ({ setShowChainDropdown, left, top }: { setShowChainDropdown: Function; left: number; top: number }) => {
  const testnetUrl = `${CONFIG.MAINNET_URL}/${CONFIG.TESTNET_NAME}`
  return (
    <ChainTypePanel
      left={left}
      top={top}
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
        <a href={testnetUrl}>{`${CONFIG.TESTNET_NAME} ${i18n.t('blockchain.testnet')}`}</a>
      </div>
    </ChainTypePanel>
  )
}

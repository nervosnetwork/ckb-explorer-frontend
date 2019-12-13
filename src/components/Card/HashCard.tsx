import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyIcon from '../../assets/copy.png'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import { copyElementValue } from '../../utils/util'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'
import SmallLoading from '../Loading/SmallLoading'

const HashCardPanel = styled.div`
  width: 100%;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  position: relative;

  @media (max-width: 700px) {
    height: 50px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }

  .hash__title {
    margin-left: 40px;
    font-size: 30px;
    font-weight: 500;
    color: #000000;
    white-space: nowrap;

    @media (max-width: 700px) {
      font-size: 15px;
      margin-left: 20px;
    }
  }

  #hash__text {
    margin-left: 20px;
    font-size: 20px;
    color: #000000;
    transform: translateY(3px);

    span {
      font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
    }

    @media (max-width: 700px) {
      font-size: 13px;
      margin-left: 10px;
      font-weight: 500;
      transform: translateY(1px);
    }
  }

  .hash__copy_icon {
    cursor: pointer;
    margin-left: 20px;
    transform: translateY(6px);

    @media (max-width: 700px) {
      margin-left: 10px;
      transform: translateY(3px);
    }

    > img {
      width: 21px;
      height: 24px;

      @media (max-width: 700px) {
        width: 16px;
        height: 18px;
        margin-bottom: 3px;
      }
    }
  }

  a {
    margin-left: 10px;
    font-size: 18px;
    margin-top: 8px;
    color: ${props => props.theme.primary} @media (max-width: 700px) {
      margin-left: 5px;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  a:hover {
    color: ${props => props.theme.primary};
  }

  #hash__value {
    color: #ffffff;
    position: absolute;
    bottom: -30px;
  }
`

const LoadingPanel = styled.div`
  width: 100%;
`

export default ({
  title,
  hash,
  dispatch,
  loading,
  fullAddress = '',
}: {
  title: string
  hash: string
  dispatch: AppDispatch
  loading?: boolean
  fullAddress?: string
}) => {
  return (
    <HashCardPanel id="hash_content">
      <div className="hash__title">{title}</div>
      {loading ? (
        <LoadingPanel>
          <SmallLoading />
        </LoadingPanel>
      ) : (
        <div id="hash__text">
          <span>{isMobile() ? adaptMobileEllipsis(hash, fullAddress ? 5 : 6) : adaptPCEllipsis(hash, 15, 25)}</span>
        </div>
      )}
      <div
        className="hash__copy_icon"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          copyElementValue(document.getElementById('hash__value'))
          dispatch({
            type: AppActions.ShowToastMessage,
            payload: {
              message: i18n.t('common.copied'),
            },
          })
        }}
      >
        {!loading && <img src={CopyIcon} alt="copy" />}
      </div>
      {fullAddress && (
        <Tooltip title={i18n.t('address.vesting_tooltip')}>
          <Link to={`/address/${fullAddress}`}>{i18n.t('address.vesting')}</Link>
        </Tooltip>
      )}
      <div id="hash__value">{hash}</div>
    </HashCardPanel>
  )
}

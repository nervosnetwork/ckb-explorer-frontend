import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyIcon from '../../assets/copy.png'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import { adaptPCEllipsis, adaptMobileEllipsis } from '../../utils/string'
import { copyElementValue } from '../../utils/util'
import { AppActions } from '../../contexts/providers/reducer'
import SmallLoading from '../Loading/SmallLoading'
import { useDispatch } from '../../contexts/providers'
import SimpleButton from '../SimpleButton'

const HashCardPanel = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 0 40px;

  @media (max-width: 750px) {
    padding: 0 16px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
  }

  .hash__card__content__panel {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    position: relative;

    @media (max-width: 750px) {
      height: auto;
      flex-direction: ${(props: { isColumn: boolean }) => (props.isColumn ? 'column' : 'row')};
      align-items: ${(props: { isColumn: boolean }) => (props.isColumn ? 'flex-start' : 'center')};
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }

  .hash__icon {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  .hash__title {
    font-size: 26px;
    font-weight: 600;
    color: #000000;
    white-space: nowrap;

    @media (max-width: 750px) {
      font-size: 15px;
    }
  }

  .hash__card__hash__content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #hash__text {
    margin-left: 20px;
    font-size: 18px;
    color: #000000;
    transform: translateY(3px);

    @media (max-width: 750px) {
      font-size: 13px;
      margin-left: ${(props: { isColumn: boolean }) => (props.isColumn ? '0px' : '10px')};
      font-weight: 500;
      transform: translateY(1px);
    }
  }

  .hash__copy_icon {
    cursor: pointer;
    margin-left: 20px;
    transform: translateY(6px);

    @media (max-width: 750px) {
      margin-left: 10px;
      transform: translateY(3px);
    }

    > img {
      width: 21px;
      height: 24px;

      @media (max-width: 750px) {
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
    color: ${props => props.theme.primary};

    @media (max-width: 750px) {
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
  loading,
  specialAddress = '',
  iconUri,
  children,
}: {
  title: string
  hash: string
  loading?: boolean
  specialAddress?: string
  iconUri?: string
  children?: ReactNode
}) => {
  const dispatch = useDispatch()

  const mobileHash = () => {
    if (specialAddress) {
      return adaptMobileEllipsis(hash, 4)
    } else if (iconUri) {
      return adaptMobileEllipsis(hash, 12)
    }
    return adaptMobileEllipsis(hash, 4)
  }

  return (
    <HashCardPanel isColumn={!!iconUri}>
      <div className="hash__card__content__panel" id="hash_content">
        {iconUri && isMobile() ? (
          <div>
            <img className="hash__icon" src={iconUri} alt="hash icon" />
            <div className="hash__title">{title}</div>
          </div>
        ) : (
          <>
            {iconUri && <img className="hash__icon" src={iconUri} alt="hash icon" />}
            <div className="hash__title">{title}</div>
          </>
        )}
        <div className="hash__card__hash__content">
          {loading ? (
            <LoadingPanel>
              <SmallLoading />
            </LoadingPanel>
          ) : (
            <div id="hash__text">
              <span>{isMobile() ? mobileHash() : adaptPCEllipsis(hash, 13, 25)}</span>
            </div>
          )}
          <SimpleButton
            className="hash__copy_icon"
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
          </SimpleButton>
        </div>
        {specialAddress && (
          <Tooltip title={i18n.t('address.vesting_tooltip')} placement={isMobile() ? 'bottomRight' : 'bottom'}>
            <Link to={`/address/${specialAddress}`}>{i18n.t('address.vesting')}</Link>
          </Tooltip>
        )}
        <div id="hash__value">{hash}</div>
      </div>
      {children}
    </HashCardPanel>
  )
}

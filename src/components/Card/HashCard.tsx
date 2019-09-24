import React, { useLayoutEffect, useState, Dispatch, SetStateAction, useContext } from 'react'
import styled from 'styled-components'
import CopyIcon from '../../assets/copy.png'
import i18n from '../../utils/i18n'
import { isMobile } from '../../utils/screen'
import { startEndEllipsis, adaptPCEllipsis } from '../../utils/string'
import { copyElementValue } from '../../utils/util'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
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

  .address_hash__title {
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

  #address_hash__text {
    margin-left: 20px;
    font-size: 20px;
    color: #000000;
    transform: translateY(3px);

    @media (max-width: 700px) {
      font-size: 13px;
      margin-left: 10px;
      font-weight: 500;
      transform: translateY(1px);
    }
  }

  .address_hash__copy_icon {
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
      }
    }
  }

  #address_hash__value {
    color: #ffffff;
    position: absolute;
    bottom: -30px;
  }
`

const LoadingPanel = styled.div`
  width: 100%;
`

const handleHashText = (hash: string, isMobileDeivce: boolean, setHashText: Dispatch<SetStateAction<string>>) => {
  if (!isMobileDeivce) {
    setHashText(hash)
    return
  }
  const contentElement = document.getElementById('address_hash_content')
  const hashElement = document.getElementById('address_hash__text')
  if (hashElement && contentElement) {
    const contentReact = contentElement.getBoundingClientRect()
    const hashReact = hashElement.getBoundingClientRect()
    const textWidth = contentReact.width - hashReact.left - 16 - 20
    const textLength = Math.round(textWidth / 8.0)
    const startLength = Math.round(textLength / 2)
    const text = startEndEllipsis(hash, textLength - startLength, startLength)
    setHashText(text)
  }
}

export default ({
  title,
  hash,
  dispatch,
  loading,
}: {
  title: string
  hash: string
  dispatch: AppDispatch
  loading?: boolean
}) => {
  const [hashText, setHashText] = useState(hash)
  const isMobileDeivce = isMobile()
  const { app } = useContext(AppContext)

  // render again when language and title change
  useLayoutEffect(() => {
    if (app.language && title) {
      handleHashText(hash, isMobileDeivce, setHashText)
    }
  }, [app.language, hash, title, isMobileDeivce])

  return (
    <HashCardPanel id="address_hash_content">
      <div className="address_hash__title">{title}</div>
      {loading ? (
        <LoadingPanel>
          <SmallLoading />
        </LoadingPanel>
      ) : (
        <div id="address_hash__text">
          <code>{adaptPCEllipsis(hashText, 18, 30)}</code>
        </div>
      )}
      <div
        className="address_hash__copy_icon"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          copyElementValue(document.getElementById('address_hash__value'))
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
      <div id="address_hash__value">{hash}</div>
    </HashCardPanel>
  )
}

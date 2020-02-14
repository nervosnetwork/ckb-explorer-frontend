import React from 'react'
import styled from 'styled-components'
import i18n, { currentLanguage, changeLanguage } from '../../utils/i18n'
import { useDispatch } from '../../contexts/providers'
import { AppActions } from '../../contexts/providers/reducer'

export const LanguagePanel = styled.div`
  width: 70px;
  height: 74px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  color: #000000;

  left: ${(props: { left: number; top: number }) => props.left}px;
  top: ${(props: { left: number; top: number }) => props.top}px;

  .language_selected {
    width: 90%;
    font-size: 14px;
    height: 33px;
    line-height: 33px;
    margin: 3px 5% 0 5%;
    padding: 0 5%;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #f1f1f1;
    }
  }
  .language_normal {
    width: 90%;
    font-size: 14px;
    height: 33px;
    line-height: 33px;
    margin: 0px 5% 3px 5%;
    padding: 0 5%;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #f1f1f1;
    }
  }

  .language_separate {
    width: 80%;
    height: 0.5px;
    border: solid 0.5px #c3c3c3;
    margin: 0 10%;
  }
`

export default ({ setShowLanguage, left, top }: { setShowLanguage: Function; left: number; top: number }) => {
  const dispatch = useDispatch()
  return (
    <LanguagePanel
      left={left}
      top={top}
      onMouseLeave={() => {
        setShowLanguage(false)
      }}
    >
      <div
        className="language_selected"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowLanguage(false)
        }}
      >
        {i18n.t(currentLanguage() === 'en' ? 'navbar.language_en' : 'navbar.language_zh')}
      </div>
      <div className="language_separate" />
      <div
        className="language_normal"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowLanguage(false)
          changeLanguage(currentLanguage() === 'en' ? 'zh' : 'en')
          dispatch({
            type: AppActions.UpdateAppLanguage,
            payload: {
              language: currentLanguage() === 'en' ? 'zh' : 'en',
            },
          })
        }}
      >
        {i18n.t(currentLanguage() === 'en' ? 'navbar.language_zh' : 'navbar.language_en')}
      </div>
    </LanguagePanel>
  )
}

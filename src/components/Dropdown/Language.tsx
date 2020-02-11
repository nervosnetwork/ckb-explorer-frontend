import React from 'react'
import styled from 'styled-components'
import { currentLanguage, changeLanguage } from '../../utils/i18n'
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
    height: 36px;
    line-height: 36px;
    margin: 2px 5% 0 5%;
    padding-left: 5px;
    cursor: pointer;
    border-radius: 3px;
    background-color: #f1f1f1;
  }
  .language_normal {
    width: 100%;
    font-size: 14px;
    height: 40px;
    cursor: pointer;
    line-height: 40px;
    margin: 0px 5%;
    padding-left: 5px;
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
        {currentLanguage() === 'en' ? 'EN' : '中(简)'}
      </div>
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
        {currentLanguage() === 'en' ? '中(简)' : 'EN'}
      </div>
    </LanguagePanel>
  )
}

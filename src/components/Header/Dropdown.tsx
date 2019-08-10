import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../contexts/providers'
import { AppDispatch, AppActions } from '../../contexts/providers/reducer'
import SelectIcon from '../../assets/current_selected.png'
import DropdownIcon from '../../assets/dropdown.png'

export const HeaderLanguagePanel = styled.div`
  width: 75px;
  margin-left: 35px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #424242;
  box-shadow: 0 2px 4px 0 rgba(43, 43, 43, 0.3);
  border: solid 1px #888888;
  position: fixed;
  z-index: 100;
  right: 10vw;
  top: 24px;

  .current__language {
    padding: 0 8px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      color: white;
      font-size: 14px;
    }

    > img {
      width: 8px;
      height: 6px;
    }
  }

  .select__language {
    height: 33px;
    display: flex;
    flex-direction: column;
    align-items: center;
    display: ${(props: { showDropdown: boolean }) => (props.showDropdown ? 'inherit' : 'none')};

    .select__separate {
      height: 1px;
      width: 85%;
      background: #f7f7f7;
    }

    .select__language__text {
      display: flex;
      height: 32px;
      align-items: center;
      color: white;
      font-size: 14px;
      width: 100%;
      padding: 0 8px;
      margin: 4px 0;
    }

    &: hover {
      .select__language__text {
        background-color: #848484;
      }
    }
  }

  @media (max-width: 700px) {
    width: 43px;
    margin-left: 8px;
    border-radius: 3px;
    right: 20px;
    top: 12px;

    @media (max-width: 320px) {
      right: 12px;
    }

    .current__language {
      padding: 0 4px;
      height: 18px;

      > div {
        color: white;
        font-size: 9px;
      }

      > img {
        width: 6px;
        height: 4px;
      }
    }

    .select__language {
      height: 19px;
      padding: 3px 0;

      .select__language__text {
        padding: 0 4px;
        font-size: 9px;
        margin: 0;
      }

      &: hover {
        .select__language__text {
          background-color: #848484;
        }
      }
    }
  }
`

const showLanguage = (lan: 'en' | 'zh') => {
  return lan === 'en' ? 'EN' : '中(简)'
}
const Languages: { current: 'en' | 'zh'; select: 'en' | 'zh' } = {
  current: 'en',
  select: 'zh',
}

export default ({ dispatch }: { dispatch: AppDispatch }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [languages, setLanguages] = useState(Languages)
  const { app } = useContext(AppContext)
  const { language } = app

  useEffect(() => {
    if (language.indexOf('zh') !== -1) {
      dispatch({
        type: AppActions.UpdateAppLanguage,
        payload: {
          language: 'zh',
        },
      })
      setLanguages({
        current: 'zh',
        select: 'en',
      })
    } else {
      dispatch({
        type: AppActions.UpdateAppLanguage,
        payload: {
          language: 'en',
        },
      })
      setLanguages({
        current: 'en',
        select: 'zh',
      })
    }
  }, [language, dispatch])

  return (
    <HeaderLanguagePanel showDropdown={showLanguageDropdown}>
      <div
        className="current__language"
        onKeyDown={() => {}}
        onClick={() => {
          setShowLanguageDropdown(!showLanguageDropdown)
        }}
        role="button"
        tabIndex={-1}
      >
        <div>{showLanguage(languages.current)}</div>
        <img src={showLanguageDropdown ? DropdownIcon : SelectIcon} alt="select icon" />
      </div>
      <div
        className="select__language"
        onKeyDown={() => {}}
        onClick={() => {
          setShowLanguageDropdown(!showLanguageDropdown)
          dispatch({
            type: AppActions.UpdateAppLanguage,
            payload: {
              language: languages.select,
            },
          })
          setLanguages({
            current: languages.select,
            select: languages.current,
          })
        }}
        role="button"
        tabIndex={-1}
      >
        <div className="select__separate" />
        <div className="select__language__text">{showLanguage(languages.select)}</div>
      </div>
    </HeaderLanguagePanel>
  )
}

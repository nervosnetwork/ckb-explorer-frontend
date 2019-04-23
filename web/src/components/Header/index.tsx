import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Search from '../Search'
import logoIcon from '../../logo.png'

const HeaderDiv = styled.div`
  width: 100%;
  min-height: ${(props: { width: number }) => (130 * props.width) / 1920}px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #10274d;
  background-color: #18325d;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  padding: ${(props: { width: number }) =>
    `${(((130 - 78) / 2) * props.width) / 1920}px ${(112 * props.width) / 1920}px`};
  .header__logo, .header__menus, .header__search{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .header__logo{
    padding-left: ${(props: { width: number }) => (10 * props.width) / 1920}px;
    .header__logo__img{
      width: 78px;
      height: 75px;
      &:hover{
        transform: scale(1.1,1.1)
      }
    }
    .header__logo__text{
      padding-left: ${(props: { width: number }) => (14 * props.width) / 1920}px;
      padding-top: 26px;
      padding-bottom: 27px;
      color: #46ab81;
      font-size: 22px;
      font-weight: bold;
    }
  }
  
  .header__menus {
    padding-top: 26px;
    padding-bottom: 27px;
    min-height: 75px;
    .header__menus__item{
      margin-left: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      margin-right: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      font-size: 22px;
      font-weight: 500;
      color: #4bbc8e;
      &.header__menus__item--active, &: hover {
        color: white;
      }
    }
  }
  a {
    text-decoration: none;
  }
  .header__search{
    text-align: right;
    position: relative;
    margin: 0 auto;
    height: 75px;
    padding-top: 6px;
    padding-bottom: 7px;
    input {
      min-width: ${(props: { width: number }) => (630 * props.width) / 1920}px;
      color: rgb(186 186 186);
      height: 62px;
      font-size: 16px;
      padding: 20px;
      padding-right: ${(props: { width: number }) => (106 * props.width) / 1920}
      opacity: 0.2;
      background-color: #ffffff;
      border-radius: 6px;
      &: focus{
        color: black;
        opacity: 1;
      }
    }
    div{
      position: absolute;
      right: ${(props: { width: number }) => (16 * props.width) / 1920}px
      top: 0;
      height: 100%;
      width: 41px;
      display: flex;
      align-items: center;
      img{
        width: 41px;
        height: 41px;
        opacity: 0.8;
        &: hover{
          opacity: 1;
          cursor: pointer;
        }
    }
    
  }
  
`
const menus = [
  {
    name: 'Wallet',
    url: '/block',
  },
  {
    name: 'Faucet',
    url: '/transaction',
  },
  {
    name: 'Docs',
    url: '/address',
  },
]

export default ({ search = true }: { search?: boolean }) => {
  return (
    <HeaderDiv width={window.innerWidth}>
      <Link to="/" className="header__logo">
        <img className="header__logo__img" src={logoIcon} alt="logo" />
        <span className="header__logo__text">CKB Testnet Explorer</span>
      </Link>
      <div className="header__menus">
        {menus.map((d: any) => {
          return (
            <a key={d.name} className="header__menus__item" href={d.url} target="_blank" rel="noopener noreferrer">
              {d.name}
            </a>
          )
        })}
      </div>
      {search && <Search />}
    </HeaderDiv>
  )
}

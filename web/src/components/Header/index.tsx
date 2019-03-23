import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import searchIcon from '../../asserts/search.png'
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
  .header--logo, .header--menus, .header--search{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .header--logo{
    padding-left: ${(props: { width: number }) => (10 * props.width) / 1920}px;
    .header--logo--img{
      width: 78px;
      height: 75px;
      &:hover{
        transform: scale(1.1,1.1)
      }
    }
    .header--logo--text{
      padding-left: ${(props: { width: number }) => (14 * props.width) / 1920}px;
      padding-top: 26px;
      padding-bottom: 27px;
      color: #46ab81;
      font-size: 22px;
      font-weight: bold;
    }
  }
  
  .header--menus {
    padding-top: 26px;
    padding-bottom: 27px;
    min-height: 75px;
    .header--menus--item{
      margin-left: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      margin-right: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      font-size: 22px;
      font-weight: 900;
      color: #4bbc8e;
      &: hover {
        color: white;
        cursor: pointer;
      }
    }
  }
  a {
    text-decoration: none;
  }
  .header--search{
    text-align: right;
    position: relative;
    margin: 0 auto;
    height: 75px;
    padding-top: 6px;
    padding-bottom: 7px;
    input {
      min-width: ${(props: { width: number }) => ((662 - 112) * props.width) / 1920}px;
      color: rgb(186 186 186);
      height: 62px;
      font-size: 16px;
      padding: 20px;
      padding-right: ${(props: { width: number }) => (106 * props.width) / 1920}
      opacity: 0.2;
      border-radius: 6px;
      background-color: #ffffff;
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
    
  }
  
`
const menus = [
  {
    name: 'CKB Wallet',
    url: '/block',
  },
  {
    name: 'CKB Faucet',
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
      <Link to="/" className="header--logo">
        <img className="header--logo--img" src={logoIcon} alt="logo" />
        <span className="header--logo--text">CKB Testnet Explorer</span>
      </Link>
      <div className="header--menus">
        {menus.map((d: any) => {
          return (
            <Link key={d.name} className="header--menus--item" to={d.url}>
              {d.name}
            </Link>
          )
        })}
      </div>
      {search ? (
        <div className="header--search">
          <input type="text" placeholder="Block Height / Block Hash / Txhash / Address" />
          <div>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
      ) : null}
    </HeaderDiv>
  )
}

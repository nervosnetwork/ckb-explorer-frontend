import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import searchIcon from '../../asserts/search.png'
import logoIcon from '../../logo.png'
const HeaderDiv = styled.div`
  transform-origin: top left;
  transform: scaleY(${(props:{width: number}) => props.width/1920});
  overflow-x: hidden;
  width: 100%;
  min-height: 130px;
  box-shadow: 0 2px 4px 0 #10274d;
  background-color: #18325d;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  display: flex;
  align-items: center;
  .logo{
    width: ${542/1920 * 100}%
    height: 75px;
    display: flex;
    align-items: center;
    padding-left: ${122/1920 * 100}%
    .logo--img{
      width: auto;
      height: 75px;
    }
    .logo--text{
      flex: 1;
      padding-left: ${14/542 * 100 }%;
      color: #46ab81;
      font-size: 22px;
      font-weight: bold;
    }
  }
  
  .menu {
    width: ${716/1920* 100}%;
    display: flex;
    .menuItem{
      margin-left: ${92/1920* 100}%;
      font-size: 22px;
      font-weight: 900;
      height: 50px;
      line-height: 50px;
      color: #4bbc8e;
      &: hover {
        color: white;
        cursor: pointer;
      }
      &: nth-child(1) {
        margin-left: 0;
      }
      
    }
  }
  a {
    text-decoration: none;
  }
  .search{
    text-align: right;
    position: relative;
    width: ${662/1920* 100}%;
    padding-right: ${112/1920* 100}%;
    input {
      width: 100%;
      color: #bababa;
      height: 62px;
      font-size: 16px;
      padding: 20px 0;
      padding-left: ${20/662* 100}%;
      padding-right: ${106/662* 100}%
      opacity: 0.2;
      border-radius: 6px;
      background-color: #ffffff;
      &: focus{
        color: black;
        opacity: 1;
      }
    }
    img{
      position: absolute;
      right: ${(16 + 112)/660*100}%
      top: 10px;;
      width: auto;
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

export default ({ search = true}:{search?: boolean}) => {
  return (
    <HeaderDiv width={window.innerWidth}>
      <Link to='/' className='logo'>
        <img className='logo--img' src={logoIcon}/>
        <span className='logo--text'>CKB Testnet Explorer</span>
      </Link>
      <div className='menu'>
        {menus.map((d: any) => {
          return (
            <Link
              key={d.name}
              className='menuItem'
              to={d.url}
            >
              {d.name}
            </Link>
          )
        })}
      </div>
      {
        search ?<div className='search'>
        <input type='text' placeholder="Block Height / Block Hash / Txhash / Address"/>
        <img src={searchIcon}/>
      </div>:null
      }
      
    </HeaderDiv>
  )
}

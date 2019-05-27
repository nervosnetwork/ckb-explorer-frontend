import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Search from '../Search'
import logoIcon from '../../asserts/ckb_logo.png'

const HeaderDiv = styled.div`
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 #141414;
  background-color: #424242;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  padding: 1px 82px;
  @media (max-width: 700px) {
    padding: 1px ${(props: { width: number }) => (150 * props.width) / 1920}px;
  }
  .header__logo,
  .header__menus,
  .header__search {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .header__logo {
    padding-left: ${(props: { width: number }) => (7 * props.width) / 1920}px;
    .header__logo__img {
      width: 72px;
      height: 60px;
    }
  }

  .header__menus {
    padding-top: 26px;
    padding-bottom: 27px;
    padding-left: ${(props: { width: number }) => (41 * props.width) / 1920}px;
    min-height: 75px;
    .header__menus__item {
      margin-left: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      margin-right: ${(props: { width: number }) => (92 * props.width) / 1920 / 2}px;
      font-size: 22px;
      font-weight: 600;
      line-height: 30px;
      color: #3cc68a;
      &.header__menus__item--active,&: hover {
        color: white;
      }
    }
  }
  .header__search {
    flex: 1;
    justify-content: flex-end;
    > div {
      display: flex;
      align-items: center;
      height: 50px;
      width: ${(props: { width: number }) => (550 * props.width) / 1920}px;
      min-width: 420px;

      @media (max-width: 700px) {
        width: ${(props: { width: number }) => (400 * props.width) / 1920}px;
        min-width: 320px;
      }
    }
  }
  a {
    text-decoration: none;
  }
`

const menus = [
  {
    name: 'Wallet',
    url: 'https://github.com/nervosnetwork/neuron',
  },
  {
    name: 'Docs',
    url: 'https://docs.nervos.org/',
  },
]

export default ({ search = true }: { search?: boolean }) => {
  return (
    <HeaderDiv width={window.innerWidth}>
      <Link to="/" className="header__logo">
        <img className="header__logo__img" src={logoIcon} alt="logo" />
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
      {search && (
        <div className="header__search">
          <div>
            <Search />
          </div>
        </div>
      )}
    </HeaderDiv>
  )
}

import React from 'react'
import styled from 'styled-components'

import browserHistory from '../../routes/history'

const HeaderDiv = styled.div`
  width: 100%;
  height: 100px;
  position: sticky;
  position: -webkit-sticky;
  overflow-x: hidden;
  top: 0;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    padding: 10px 40px;
    &: hover {
      background-color: grey;
      cursor: pointer;
    }
  }
`
const menus = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'block',
    url: '/block',
  },
  {
    name: 'transaction',
    url: '/transaction',
  },
  {
    name: 'address',
    url: '/address',
  },
]

export default () => {
  return (
    <HeaderDiv>
      {menus.map((d: any) => {
        return (
          <div
            key={d.name}
            role="menu"
            tabIndex={0}
            onClick={() => browserHistory.push(d.url)}
            onKeyPress={() => browserHistory.push(d.url)}
            style={{
              textAlign: 'center',
              background: browserHistory.location.pathname === d.url ? 'grey' : 'transparent',
            }}
          >
            {d.name}
          </div>
        )
      })}
    </HeaderDiv>
  )
}

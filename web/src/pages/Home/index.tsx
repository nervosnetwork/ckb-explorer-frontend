import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import HomeLogo from '../../asserts/logo_home.png'

const HomeHeader = styled.div`
  height: 335px;
  width: 100%;
  background: rgb(24,50,93);
`

const LogoPanel = styled.div`
  position: relative;
  top: 73.5px;
  height: 74.5px;
  width: auto;
  dispaly: flex;
  display: -webkit-flex; /* Safari */
  justify-content: center;
  flex-direction: row;
  img {
    width: 78px;
    height: 74.5px;
  }
  div {
    line-height: 74.5px;
    margin-left: 14.5px;
    color: #46ab81;
    font-size: 22px;
    font-weight: bold;
  }
`

export default () => {
  return (
    <Page>
      <Header search={false} />
      <Content>
        <HomeHeader>
          <LogoPanel>
            <img src={HomeLogo} alt='home logo'></img>
            <div>CKB Explorer Testnet</div>
          </LogoPanel>
        </HomeHeader>
      </Content>
      <Footer />
    </Page>
  )
}

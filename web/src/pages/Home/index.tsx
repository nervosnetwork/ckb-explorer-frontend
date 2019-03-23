import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import HomeLogo from '../../asserts/logo_home.png'
import SearchLogo from '../../asserts/search.png'

const HomeHeader = styled.div`
  height: 670px;
  width: 100%;
  background: rgb(24, 50, 93);
  display: flex;
  flex-direction: column;
`

const LogoPanel = styled.div`
  position: relative;
  top: 147px;
  height: 149px;
  width: auto;
  justify-content: center;
  dispaly: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  img {
    width: 156px;
    height: 149px;
  }
  div {
    line-height: 156px;
    margin-left: 29px;
    color: #46ab81;
    font-size: 40px;
    font-weight: bold;
  }
`

const SearchPanel = styled.div`
  align-items: center;
  position: relative;
  top: 247px;
  width: auto;
  height: 65px;
  text-align: center;
  input {
    position: relative;
    width: 650px;
    color: #bababa;
    height: 65px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 106px;
    opacity: 0.2;
    border-radius: 6px;
    background-color: #ffffff;
    &: focus {
      color: black;
      opacity: 1;
    }
  }
  img {
    position: relative;
    top: 14px;
    right: 50px;
    width: 41px;
    height: 41px;
    opacity: 0.8;
    &: hover {
      opacity: 1;
      cursor: pointer;
    }
  }
`

export default () => {
  return (
    <Page>
      <Header search={false} />
      <Content>
        <HomeHeader>
          <LogoPanel>
            <img src={HomeLogo} alt="home logo" />
            <div>CKB Explorer Testnet</div>
          </LogoPanel>
          <SearchPanel>
            <input placeholder="Block Heigth / Block Hash / TxHash / Address" />
            <img src={SearchLogo} alt="search logo" />
          </SearchPanel>
        </HomeHeader>
      </Content>
      <Footer />
    </Page>
  )
}

import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import HomeLogo from '../../asserts/logo_home.png'
import SearchLogo from '../../asserts/search.png'

const HomeHeaderPanel = styled.div`
  height: ${(props: { width: number }) => (670 * props.width) / 1920}px;
  width: 100%;
  background: rgb(24, 50, 93);
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HomeHeader = styled.div`
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
`

const LogoPanel = styled.div`
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
    font-size: 50px;
    font-weight: bold;
  }
`

const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (98 * props.width) / 1920}px;
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

const BlockPanel = styled.div`
  width: 100%;
  height: 200px;
  margin-top: ${(props: { width: number }) => (150 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
`

const ContentTitle = styled.div`
  display: flex;
  flex-direction: column;

  div {
    font-size: 50px;
    color: black;
    margin: 0 auto;
  }

  span {
    background: #46ab81;
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }
`

export default () => {
  return (
    <Page>
      <Header search={false} />
      <Content>
        <HomeHeaderPanel width={window.innerWidth}>
          <HomeHeader>
            <LogoPanel>
              <img src={HomeLogo} alt="home logo" />
              <div>CKB Testnet Explorer</div>
            </LogoPanel>
            <SearchPanel width={window.innerWidth}>
              <input placeholder="Block Heigth / Block Hash / TxHash / Address" />
              <img src={SearchLogo} alt="search logo" />
            </SearchPanel>
          </HomeHeader>
        </HomeHeaderPanel>

        <BlockPanel width={window.innerWidth}>
          <ContentTitle>
            <div>Latest Blocks</div>
            <span />
          </ContentTitle>
        </BlockPanel>
      </Content>
      <Footer />
    </Page>
  )
}

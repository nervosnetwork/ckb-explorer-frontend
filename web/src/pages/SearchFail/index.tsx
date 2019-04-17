import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import SearchLogo from '../../asserts/search.png'

const SearchPanel = styled.div`
  margin-top: ${(props: { width: number }) => (350 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (440 * props.width) / 1920}px;
`

const SearchInput = styled.div`
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  height: 65px;
  text-align: center;
  position: relative;
  > input {
    position: relative;
    width: 100%;
    color: #bababa;
    height: 65px;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 106px;
    border: 2px solid rgb(24, 50, 93);
    border-radius: 6px;
    background-color: #ffffff;
    &: focus {
      color: black;
      opacity: 1;
    }
  }

  > img {
    position: absolute;
    top: 14px;
    right: 9px;
    width: 41px;
    height: 41px;
    opacity: 0.8;
    &: hover {
      opacity: 1;
      cursor: pointer;
    }
  }
`

const SearchContent = styled.div`
  font-size: 20px;
  max-width: 423px;
  margin: 0 auto;
  margin-top: 39px;
  text-align: center;
`

export default () => {
  return (
    <Page>
      <Header search={false} />
      <Content>
        <SearchPanel width={window.innerWidth} className="container">
          <SearchInput>
            <input placeholder="Block Heigth / Block Hash / TxHash / Address" />
            <img src={SearchLogo} alt="search logo" />
          </SearchInput>
          <SearchContent>Opps! Your search did not match any record. Please try different keywords~</SearchContent>
        </SearchPanel>
      </Content>
      <Footer />
    </Page>
  )
}

import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import NotFoundIcon from '../../asserts/not_found_404.png'
import browserHistory from '../../routes/history'

const NotFoundPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (210 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (174 * props.width) / 1920}px;
`

const NotFoundImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 757px;
  max-height: 357px;
  display: block;
  margin: 0 auto;
`

const GoBackButton = styled.div`
  width: 331px;
  height: 68px;
  margin: 0 auto;
  margin-top: ${(props: { width: number }) => (155 * props.width) / 1920}px;
  font-size: 30px;
  text-align: center;
  line-height: 68px;
  background: white;
  border: 2px solid rgb(62, 80, 130);
  border-radius: 34px;
  box-shadow: 6px 6px 11px rgb(111, 132, 165);
  &:hover {
    cursor: pointer;
  }
`

export default () => {
  return (
    <Page>
      <Header />
      <Content>
        <NotFoundPanel width={window.innerWidth} className="container">
          <NotFoundImage src={NotFoundIcon} alt="404" />
          <GoBackButton
            width={window.innerWidth}
            onClick={() => {
              browserHistory.goBack()
            }}
          >
            {'GO BACK'}
          </GoBackButton>
        </NotFoundPanel>
      </Content>
      <Footer />
    </Page>
  )
}

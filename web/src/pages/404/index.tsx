import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import NotFoundIcon from '../../asserts/not_found_404.png'

const NotFoundPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (210 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (174 * props.width) / 1920}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NotFoundImage = styled.img`
  width: 757px;
  height: 357px;
`

const GoBackButton = styled.div`
  width: 331px;
  height: ${(props: { width: number }) => (68 * props.width) / 1920}px;
  margin-top: ${(props: { width: number }) => (155 * props.width) / 1920}px;
  font-size: 30px;
  text-align: center;
  line-height: ${(props: { width: number }) => (68 * props.width) / 1920}px;
  background: white;
  border: 2px solid rgb(62, 80, 130);
  border-radius: ${(props: { width: number }) => (34 * props.width) / 1920}px;
  box-shadow: 6px 6px 11px rgb(111, 132, 165);
`

export default (props: any) => {
  return (
    <Page>
      <Header />
      <Content>
        <NotFoundPanel width={window.innerWidth}>
          <NotFoundImage src={NotFoundIcon} alt="404" />
          <GoBackButton
            width={window.innerWidth}
            onClick={() => {
              props.history.goBack()
            }}
          >
            GO BACK
          </GoBackButton>
        </NotFoundPanel>
      </Content>
      <Footer />
    </Page>
  )
}

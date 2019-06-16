import React from 'react'
import styled from 'styled-components'
import Content from '../../components/Content'
import NotFoundIcon from '../../assets/not_found_404.png'

const NotFoundPanel = styled.div`
  width: 100%;
  margin-top: 127px;
  margin-bottom: 105px;
`

const NotFoundImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 757px;
  max-height: 357px;
  display: block;
  margin: 0 auto;

  @media (max-width: 700px) {
    width: 80%;
  }
`

export default () => {
  return (
    <Content>
      <NotFoundPanel className="container">
        <NotFoundImage src={NotFoundIcon} alt="404" />
      </NotFoundPanel>
    </Content>
  )
}

import React from 'react'
import styled from 'styled-components'

const FooterDiv = styled.div`
  width: 100%;
  overflow-x: hidden;
  height: 100px;
  background-color: lightgrey;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`
export default () => {
  return <FooterDiv>footer</FooterDiv>
}

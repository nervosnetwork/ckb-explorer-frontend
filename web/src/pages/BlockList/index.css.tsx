import styled from 'styled-components'

export const BlockListPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (150 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  &:after {
    content: '';
    background: #46ab81;
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;
  }
`

export const ContentTable = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 58px;
`

export const BlocksPagition = styled.div`
  margin-top: 60px;
`

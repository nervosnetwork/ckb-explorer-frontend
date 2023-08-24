import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const TableTitleRow = styled.div`
  background: white;
  display: flex;
  min-height: 65px;
  border-radius: 6px 6px 0 0;
  padding: 0 20px;
  margin-bottom: 4px;

  @media (max-width: 750px) {
    flex-flow: row wrap;
    min-height: auto;
    padding: 5px 20px;
  }
`

export const TableTitleRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${({ width }: { width: string }) => width};
  min-height: 65px;

  > div,
  > button {
    border: none;
    outline: none;
    background-color: transparent;
    color: #333333;
    font-size: 18px;
    font-weight: 450;
    text-align: center;

    @media (width <= 1000px) {
      font-size: 16px;
    }
  }

  @media (max-width: 750px) {
    margin: 10px 40px 10px 0;
    min-height: auto;
  }
`

export const TableContentRow = styled.div`
  position: relative;
  display: flex;
  min-height: 60px;
  background-color: white;
  padding: 20px;

  ::after {
    content: '';
    position: absolute;
    display: block;
    width: auto;
    height: 1px;
    left: 20px;
    right: 20px;
    bottom: 1px;
    background: #d8d8d8;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }

  :hover {
    background: #f8f9fa;
  }
`

export const TableContentRowItem = styled.div`
  width: ${({ width }: { width: string }) => width};
  color: #000;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-overflow: ellipsis;
  font-size: 16px;

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const TableMinerContentPanel = styled.div`
  width: ${(props: { width: string }) => props.width};
  min-width: 0;
  line-height: 20px;
  text-align: center;
  margin: auto 0;

  .table__miner__content {
    color: ${(props: { theme: any }) => props.theme.primary};
    text-decoration: none;
  }

  .table__miner__text {
    width: 100%;
    justify-content: center;
    font-size: ${(props: { width: string; fontSize: string }) => props.fontSize};
    font-weight: 500;

    @media (width <= 750px) {
      font-size: 13px;
    }
  }

  .table__miner__text__disable {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: { width: string; fontSize: string }) => props.fontSize};
    color: #000;

    @media (width <= 750px) {
      font-size: 13px;
    }
  }
`

export const HighlightLink = styled(props => <Link {...props} />)`
  color: ${props => props.theme.primary};
  text-decoration: none;
`

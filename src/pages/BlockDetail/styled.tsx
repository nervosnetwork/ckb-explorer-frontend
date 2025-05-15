import styled from 'styled-components'
import variables from '../../styles/variables.module.scss'

export const BlockDetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    margin: 0;
    padding: 20px;
  }
`

export const BlockLinkPanel = styled.div`
  min-width: 0;

  a {
    font-weight: 500;
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const BlockMinerRewardPanel = styled.div`
  display: flex;
  flex-direction: row;

  .blockMinerRewardTip {
    display: flex;
    align-items: center;
  }

  img {
    width: ${(props: { sent: boolean }) => (props.sent ? '30px' : '15px')};
    margin: ${(props: { sent: boolean }) => (props.sent ? '0 0 3px 5px' : '3px 0 0 5px')};
    cursor: ${(props: { sent: boolean }) => (props.sent ? 'pointer' : 'default')};

    @media (max-width: ${variables.mobileBreakPoint}) {
      width: ${(props: { sent: boolean }) => (props.sent ? '27px' : '15px')};
      margin-bottom: ${(props: { sent: boolean }) => (props.sent ? '1px' : '0')};
    }
  }
`

export const BlockMinerMessagePanel = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;

  .blockMinerMessageUtf8 {
    width: 15px;
    height: 15px;
    margin-top: 2px;
    margin-left: 6px;
  }
`

export const BlockTransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`

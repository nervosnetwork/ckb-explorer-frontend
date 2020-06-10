import styled from 'styled-components'

export const BlockDetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    margin: 0px;
    padding: 20px;
  }
`

export const BlockRootInfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 14px;

  > span {
    width: 100%;
    height: 1px;
    background: #e5e5e5;
  }
`

export const BlockRootInfoItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 750px) {
    height: 20px;
    margin-top: 14px;
  }

  .block__root_info_title {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }
  .block__root_info_value {
  }
`

export const BlockLinkPanel = styled.div`
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

  .block__miner__reward_tip {
    display: flex;
    align-items: center;
  }

  img {
    width: ${(props: { sent: boolean }) => (props.sent ? '30px' : '18px')};
    height： 18px;
    margin-left: 5px;
    margin-bottom: ${(props: { sent: boolean }) => (props.sent ? '3px' : '0')};
    cursor: ${(props: { sent: boolean }) => (props.sent ? 'pointer' : 'default')};

    @media(max-width: 750px) {
      width: ${(props: { sent: boolean }) => (props.sent ? '27px' : '16px')};
      height： 16px;
      margin-bottom: ${(props: { sent: boolean }) => (props.sent ? '1px' : '0')};
    }
  }
`

export const BlockOverviewDisplayControlPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  transform: translateY(10px);

  @media (max-width: 750px) {
    transform: translateY(7.5px);
  }

  > img {
    width: 21px;
    height: 8px;
    margin-bottom: 8px;
  }
`

export const BlockTransactionsPagination = styled.div`
  margin-top: 4px;
  width: 100%;
`

export const BlockNoncePanel = styled.div``

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

export const BlockRootInfoItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (min-width: 750px) {
    height: 20px;
    margin-top: 20px;
  }

  .block__root_info_title {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }
  .block__root_info_value {
    flex: 1;
    margin-left: 20px;
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
  width: 100%;
  height: 8px;
  transform: translateY(10px);

  @media (max-width: 750px) {
    transform: translateY(7.5px);
  }

  > img {
    margin: auto auto;
    width: 21px;
    height: 8px;
  }
`

export const BlockTransactionsPagination = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 750px) {
    margin: 10px 0px 0px 0px;
  }
`

export const BlockNoncePanel = styled.div``

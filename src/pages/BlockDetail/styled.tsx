import styled from 'styled-components'

export const BlockDetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 0px;
    padding: 20px;
  }
`

export const BlockRootInfoItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (min-width: 700px) {
    height: 20px;
    margin-top: 20px;
  }

  .block__root_info_title {
    font-weight: 500;
  }
  .block__root_info_value {
    flex: 1;
    margin-left: 20px;
  }
`

export const BlockLinkPanel = styled.div`
  > a {
    font-weight: 500;
    color: ${props => props.theme.primary};
  }
`

export const BlockOverviewItemContentPanel = styled.div`
  display: flex;
  flex-direction: row;

  .block__overview_item_value {
  }
  .block__overview_item_tip {
    margin-left: 20px;
    font-weight: 500;
    color: #ff5757;
    &:focus {
      outline: 0;
    }
    @media (max-width: 700px) {
      margin-left: 10px;
    }
  }
  > div:nth-child(1) {
    margin-left: 0px;
  }
`

export const BlockOverviewDisplayControlPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 8px;
  transform: translateY(10px);

  @media (max-width: 700px) {
    transform: translateY(7.5px);
  }

  > img {
    margin: auto auto;
    width: 21px;
    height: 8px;
  }
`

export const BlockTransactionsPagition = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0px 0px 0px;
  }
`

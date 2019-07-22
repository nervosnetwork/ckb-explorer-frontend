import styled from 'styled-components'
import { CommonPagition } from '../BlockList/styled'

export const BlockDetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
    margin-top: 30px;
    margin-bottom: 0px;
    padding: 0px 20px 20px 20px;
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

export const BlockMinerPanel = styled.div`
  font-weight: 500;
  color: #3cc68a;
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
  }
  > div:nth-child(1) {
    margin-left: 0px;
  }
`

export const BlockTransactionsPagition = styled(CommonPagition)`
  margin: 40px 0 0px 0;
  width: 100%;

  @media (max-width: 700px) {
    margin: 20px 0 0px 0;
  }
`

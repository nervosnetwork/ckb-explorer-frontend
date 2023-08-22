import styled from 'styled-components'

export const ItemCardPanel = styled.div`
  width: 100%;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  margin-top: 4px;
  border-radius: 4px;
  box-shadow: 1px 1px 3px 0 #dfdfdf;
  padding: 0 16px;
`

export const ItemContentPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  margin-right: 0;
`

export const ItemDetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  padding: 16px 0;
  border-bottom: solid #f0f0f0;
  border-bottom-width: ${({ hideLine }: { hideLine: boolean }) => (hideLine ? '0' : '1px')};

  .item__detail__title {
    color: #666;
    width: 100%;
    margin-left: 0;
    line-height: 1;
  }

  .item__detail__value {
    display: flex;
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
    line-height: 1;
    word-wrap: break-word;
    word-break: break-all;

    a {
      color: ${props => props.theme.primary};
    }

    a:hover {
      color: ${props => props.theme.primary};
    }
  }

  .block_pointer {
    cursor: pointer;
  }
`

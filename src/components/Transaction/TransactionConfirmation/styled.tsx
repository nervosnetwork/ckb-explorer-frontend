import styled from 'styled-components'

export default styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .transaction_item__confirmation {
    @media (max-width: 700px) {
      font-size: 12px;
    }

    font-size: 16px;
    color: #888888;
  }
  .transaction_item__capacity {
    @media (max-width: 700px) {
      font-size: 12px;
    }

    font-size: 16px;
    color: ${(props: { increased: boolean }) => (props.increased ? '#3cc68a' : '#ff7070')};
    flex-direction: column;
    align-items: flex-end;
  }
`

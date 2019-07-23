import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  font-size: 16px;
  color: #000000;
  text-align: center;

  .transaction__cell_hash {
    flex: 0.33;
    > a {
      color: #3cc68a;
    }
  }
  .transaction__cell_capacity {
    flex: 0.34;
  }
  .transaction__cell_detail {
    flex: 0.33;
    font-weight: 500;

    .transaction__cell_lock_script {
      flex: 0.33;
      text-align: left;
    }
    .transaction__cell_type_script {
      flex: 0.34;
    }
    ..transaction__cell_data {
      flex: 0.33;
      text-align: right;
    }
  }
`

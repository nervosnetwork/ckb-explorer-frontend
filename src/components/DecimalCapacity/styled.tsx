import styled from 'styled-components'

export const DecimalPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  .decimalUnit {
    margin-left: 5px;

    @media (max-width: 750px) {
      margin-bottom: 0;
    }
  }
`

export const DecimalPartPanel = styled.div`
  margin-bottom: ${(props: { marginBottom: string }) => (props.marginBottom ? props.marginBottom : '1px')};
  font-size: ${(props: { fontSize?: string; color?: string; marginBottom: string }) =>
    props.fontSize ? props.fontSize : '12px'};
  color: ${(props: { color?: string }) => (props.color ? props.color : '#999999')};

  @media (max-width: 1000px) {
    font-size: ${(props: { fontSize?: string }) => (props.fontSize ? props.fontSize : '11px')};
  }

  @media (max-width: 750px) {
    margin-bottom: 0;
  }
`

export const DecimalZerosPanel = styled.div`
  margin-bottom: ${(props: { marginBottom: string }) => (props.marginBottom ? props.marginBottom : '1px')};
  font-size: ${(props: { fontSize?: string; color?: string; marginBottom: string }) =>
    props.fontSize ? props.fontSize : '12px'};
  color: ${(props: { color?: string }) => (props.color ? props.color : '#999999')};

  @media (max-width: 1000px) {
    font-size: ${(props: { fontSize?: string }) => (props.fontSize ? props.fontSize : '11px')};
  }

  @media (max-width: 750px) {
    margin-bottom: 0;
  }
`

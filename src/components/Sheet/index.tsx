import React from 'react'
import styled from 'styled-components'

const SheetPanel = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  z-index: 9000;

  > div {
    width: 100%;
    background: #ff7070;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0 25px 0;

    @media (max-width: 700px) {
      top: 44px;
      padding: 10px 0 15px 0;
    }
  }
`

const SheetItem = styled.div`
  color: white;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 5px;

  @media (max-width: 700px) {
    font-size: 14px;
  }
`

const SheetPointPanel = styled.div`
  display: flex;
  align-items: top;
  justify-content: ${(props: { isSingle: boolean }) => (props.isSingle ? 'center' : 'left')};
  width: 50%;

  > span {
    margin-right: 3px;
    margin-top: 8px;
    color: white;
  }

  @media (max-width: 700px) {
    width: 86%;

    > span {
      margin-top: 0;
    }
  }
`

const Sheet = ({ contexts = [] }: { contexts?: string[] }) => {
  return contexts.length > 0 ? (
    <SheetPanel>
      <div>
        {contexts.map((context: string, index: number) => {
          const key = index
          return (
            <SheetPointPanel key={key} isSingle={contexts.length === 1}>
              {contexts.length > 1 && <span>·</span>}
              <SheetItem>{context}</SheetItem>
            </SheetPointPanel>
          )
        })}
      </div>
    </SheetPanel>
  ) : null
}

export default Sheet

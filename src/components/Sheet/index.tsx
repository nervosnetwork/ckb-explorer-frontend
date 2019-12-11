import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../contexts/providers/index'

const SheetPanel = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 64px;
  z-index: 9000;

  @media (max-width: 700px) {
    top: 42px;
  }

  > div {
    width: 100%;
    background: #ff7070;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0 20px 0;

    @media (max-width: 700px) {
      padding: 6px 0 10px 0;
    }
  }
`

const SheetItem = styled.div`
  color: white;
  font-size: 18px;
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

const Sheet = () => {
  const { app } = useContext(AppContext)
  const messages: string[] = app.appErrors[1].message.concat(app.appErrors[0].message)

  return messages.length > 0 ? (
    <SheetPanel>
      <div>
        {messages.map((context: string, index: number) => {
          const key = index
          return (
            <SheetPointPanel key={key} isSingle={messages.length === 1}>
              {messages.length > 1 && <span>·</span>}
              <SheetItem>{context}</SheetItem>
            </SheetPointPanel>
          )
        })}
      </div>
    </SheetPanel>
  ) : null
}

export default Sheet

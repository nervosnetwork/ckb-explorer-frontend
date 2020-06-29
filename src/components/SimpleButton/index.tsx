import React, { ReactNode } from 'react'
import styled from 'styled-components'

const ButtonPanel = styled.div`
  cursor: pointer;
`

const buttonAction = (event: any, action?: Function) => {
  action && action(event)
}

export default ({
  id,
  className,
  onClick,
  onMouseOver,
  children,
}: {
  id?: string
  className?: string
  onClick?: Function
  onMouseOver?: Function
  children: ReactNode | string
}) => {
  return (
    <ButtonPanel
      id={id}
      className={className}
      role="button"
      tabIndex={-1}
      onKeyDown={() => {}}
      onMouseOver={(event: any) => buttonAction(event, onMouseOver)}
      onClick={(event: any) => buttonAction(event, onClick)}
    >
      {children}
    </ButtonPanel>
  )
}

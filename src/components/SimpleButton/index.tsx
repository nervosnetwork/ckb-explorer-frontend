import React, { ReactNode } from 'react'
import styled from 'styled-components'

const ButtonPanel = styled.div`
  cursor: pointer;
`

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
      onMouseOver={(event: any) => {
        onMouseOver && onMouseOver(event)
      }}
      onClick={(event: any) => {
        onClick && onClick(event)
      }}
    >
      {children}
    </ButtonPanel>
  )
}

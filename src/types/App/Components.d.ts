declare namespace Components {
  export interface Header {
    normalHeight: boolean
    haveSearchBar: boolean
  }

  export interface Cell {
    cellState: number
    lock: State.Script
    type: State.Script
    data: State.Data
  }

  export interface Search {
    opacity: boolean | undefined
    content: string | undefined
  }
}

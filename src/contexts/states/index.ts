import initComponents from './components'

export type FetchStatus = keyof State.FetchStatus

const initState: State.AppState = {
  components: initComponents,
}

export default initState

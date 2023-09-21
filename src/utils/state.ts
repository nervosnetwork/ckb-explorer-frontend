/**
 * Since there are currently few places where global state is used, and they are all simple scenarios,
 * here we use RxJS to implement a simple global state management to avoid introducing too much complexity.
 * If more complex scenarios need to be handled in the future, zustand can be considered,
 * which supports asynchronous processing, computed properties, and is framework-agnostic.
 */
import { useObservableState } from 'observable-hooks'
import { useCallback } from 'react'
import { BehaviorSubject } from 'rxjs'

export type GlobalState<T> = BehaviorSubject<T>

export function createGlobalState<T>(initState: T): GlobalState<T> {
  return new BehaviorSubject<T>(initState)
}

export function getGlobalState<T>(globalState: GlobalState<T>): T {
  return globalState.getValue()
}

export function useGlobalState<T>(globalState: GlobalState<T>): [T, (state: T) => void] {
  const state = useObservableState(globalState)

  const setState = useCallback(
    (state: T) => {
      globalState.next(state)
    },
    [globalState],
  )

  return [state, setState]
}

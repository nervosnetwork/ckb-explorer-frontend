/**
 * Since there are currently few places where global state is used, and they are all simple scenarios,
 * here we use RxJS to implement a simple global state management to avoid introducing too much complexity.
 * If more complex scenarios need to be handled in the future, zustand can be considered,
 * which supports asynchronous processing, computed properties, and is framework-agnostic.
 */
import { useObservableState } from 'observable-hooks'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { BehaviorSubject } from 'rxjs'

export type GlobalState<T> = BehaviorSubject<T>

export function createGlobalState<T>(initState: T): GlobalState<T> {
  return new BehaviorSubject<T>(initState)
}

export function setGlobalState<T>(globalState: GlobalState<T>, value: T) {
  globalState.next(value)
}

export function getGlobalState<T>(globalState: GlobalState<T>): T {
  return globalState.getValue()
}

export function createGlobalStateSetter<T>(globalState: GlobalState<T>): (value: T) => void {
  return (value: T) => setGlobalState(globalState, value)
}

export function useGlobalState<T>(globalState: GlobalState<T>): [T, Dispatch<SetStateAction<T>>] {
  const state = useObservableState(globalState)

  const setState = useCallback<Dispatch<SetStateAction<T>>>(
    (state: T | ((prevState: T) => T)) => {
      // TODO: Here, `as` is used because `T` does not have a constraint to prohibit function types of states.
      // However, implementing this constraint is difficult, so `as` is used for now.
      const finalState =
        typeof state === 'function' ? (state as (prevState: T) => T)(getGlobalState(globalState)) : state
      globalState.next(finalState)
    },
    [globalState],
  )

  return [state, setState]
}

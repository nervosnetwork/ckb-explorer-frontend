import { useObservableState } from 'observable-hooks'
import { BehaviorSubject } from 'rxjs'
import { Dispatch, SetStateAction } from 'react'
import { appSettings } from '.'

function createPropSetter<T>(prop: BehaviorSubject<T>): Dispatch<SetStateAction<T>> {
  function isUpdater(value: unknown): value is (prevState: T) => T {
    return typeof value === 'function'
  }

  return (action: T | ((prevState: T) => T)) => {
    if (isUpdater(action)) {
      prop.next(action(prop.value))
    } else {
      prop.next(action)
    }
  }
}

export function useDefaultLanguage() {
  return [useObservableState(appSettings.defaultLanguage$), createPropSetter(appSettings.defaultLanguage$)] as const
}

export function useSearchType() {
  return [useObservableState(appSettings.searchType$), createPropSetter(appSettings.searchType$)] as const
}

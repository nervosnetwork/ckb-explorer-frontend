import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { PersistenceService, persistenceService } from '../PersistenceService'

export const NAMESPACE_APP_SETTINGS = 'appSettings'

export const KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED = `${NAMESPACE_APP_SETTINGS}_isDeprecatedAddressesDisplayed`
export const KEY_SEARCH_TYPE = `${NAMESPACE_APP_SETTINGS}_searchType`

export class AppSettings {
  isDeprecatedAddressesDisplayed$ = new BehaviorSubject(
    this.persistenceService.get<boolean>(KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED, false),
  )

  searchType$ = new BehaviorSubject(this.persistenceService.get<'id' | 'name'>(KEY_SEARCH_TYPE, 'id'))

  private callbacksAtStop?: Subscription

  constructor(private persistenceService: PersistenceService) {
    this.start()
  }

  start() {
    this.callbacksAtStop?.unsubscribe()
    this.callbacksAtStop = new Subscription()

    this.saveToStorageOnChange(this.isDeprecatedAddressesDisplayed$, KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED)
    this.saveToStorageOnChange(this.searchType$, KEY_SEARCH_TYPE)
  }

  stop() {
    this.callbacksAtStop?.unsubscribe()
  }

  private saveToStorageOnChange<T>(prop: BehaviorSubject<T>, key: string) {
    this.callbacksAtStop?.add(prop.pipe(tap(value => this.persistenceService.set<T>(key, value))).subscribe())
  }
}

export const appSettings = new AppSettings(persistenceService)

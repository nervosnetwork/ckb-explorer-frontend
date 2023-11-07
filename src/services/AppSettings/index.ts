import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { PersistenceService, persistenceService } from '../PersistenceService'
import CONFIG from '../../config'
import { SupportedLng } from '../../utils/i18n'

export const NAMESPACE_APP_SETTINGS = 'appSettings'

export const KEY_DEFAULT_LANGUAGE = `${CONFIG.CHAIN_TYPE}_${NAMESPACE_APP_SETTINGS}_defaultLanguage`
export const KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED = `${NAMESPACE_APP_SETTINGS}_isDeprecatedAddressesDisplayed`

export class AppSettings {
  defaultLanguage$ = new BehaviorSubject(this.persistenceService.get<SupportedLng>(KEY_DEFAULT_LANGUAGE, 'en'))

  isDeprecatedAddressesDisplayed$ = new BehaviorSubject(
    this.persistenceService.get<boolean>(KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED, false),
  )

  private callbacksAtStop?: Subscription

  constructor(private persistenceService: PersistenceService) {
    this.start()
  }

  start() {
    this.callbacksAtStop?.unsubscribe()
    this.callbacksAtStop = new Subscription()

    this.saveToStorageOnChange(this.defaultLanguage$, KEY_DEFAULT_LANGUAGE)
    this.saveToStorageOnChange(this.isDeprecatedAddressesDisplayed$, KEY_IS_DEPRECATED_ADDRESSES_DISPLAYED)
  }

  stop() {
    this.callbacksAtStop?.unsubscribe()
  }

  private saveToStorageOnChange<T>(prop: BehaviorSubject<T>, key: string) {
    this.callbacksAtStop?.add(prop.pipe(tap(value => this.persistenceService.set<T>(key, value))).subscribe())
  }
}

export const appSettings = new AppSettings(persistenceService)

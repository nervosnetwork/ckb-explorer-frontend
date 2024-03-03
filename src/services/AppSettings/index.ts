import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { PersistenceService, persistenceService } from '../PersistenceService'
import CONFIG from '../../config'
import { SupportedLng } from '../../utils/i18n'

export const NAMESPACE_APP_SETTINGS = 'appSettings'

export const KEY_DEFAULT_LANGUAGE = `${CONFIG.CHAIN_TYPE}_${NAMESPACE_APP_SETTINGS}_defaultLanguage`
export const KEY_SEARCH_TYPE = `${NAMESPACE_APP_SETTINGS}_searchType`

export class AppSettings {
  defaultLanguage$ = new BehaviorSubject(this.persistenceService.get<SupportedLng>(KEY_DEFAULT_LANGUAGE, 'en'))

  searchType$ = new BehaviorSubject(this.persistenceService.get<'id' | 'name'>(KEY_SEARCH_TYPE, 'id'))

  private callbacksAtStop?: Subscription

  constructor(private persistenceService: PersistenceService) {
    this.start()
  }

  start() {
    this.callbacksAtStop?.unsubscribe()
    this.callbacksAtStop = new Subscription()

    this.saveToStorageOnChange(this.defaultLanguage$, KEY_DEFAULT_LANGUAGE)
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

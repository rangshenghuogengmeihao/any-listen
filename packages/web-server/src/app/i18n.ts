import type { Langs, Locale, Message, TranslateValues } from '@any-listen/i18n'
import { fillMessage, messages } from '@any-listen/i18n'
import SingleEvent from '@any-listen/nodejs/SimpleSingleEvent'
import { appEvent, appState } from './app'

export const languageChangeEvent = new SingleEvent<[Langs]>()

export const i18n = {
  locale: 'zh-cn' as Locale,
  fallbackLocale: 'zh-cn' as Langs,
  availableLocales: Object.keys(messages) as Langs[],
  messages,
  message: messages['zh-cn'],
  setLanguage(locale?: Locale | null) {
    if (!locale || !(locale in messages)) locale = this.fallbackLocale
    this.message = messages[locale as Langs]
    languageChangeEvent.emit(locale as Langs)
  },
  getMessage(key: keyof Message, val?: TranslateValues): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    let targetMessage = this.message[key] ?? this.messages[this.fallbackLocale][key] ?? key
    return val ? fillMessage(targetMessage, val) : targetMessage
  },
  t(key: keyof Message, val?: TranslateValues): string {
    return this.getMessage(key, val)
  },
}

export const setLanguage = (lang: Langs) => {
  i18n.setLanguage(lang)
}

export const initI18n = () => {
  appEvent.on('updated_config', (keys, setting) => {
    if (!keys.includes('common.langId')) return
    i18n.setLanguage(setting['common.langId'])
  })
  i18n.setLanguage(appState.appSetting['common.langId'])
}

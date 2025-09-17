import type { Langs, Locale, Message, TranslateValues } from '@any-listen/i18n'
import { fillMessage, messages } from '@any-listen/i18n'
import { extensionEvent } from './event'
import { extensionState } from './state'

export const i18n = {
  locale: 'zh-cn' as Locale,
  fallbackLocale: 'zh-cn' as Langs,
  availableLocales: Object.keys(messages) as Langs[],
  messages,
  message: messages['zh-cn'],
  setLanguage(locale?: Locale | null) {
    this.message = locale && locale in messages ? messages[locale as Langs] : messages[this.fallbackLocale]
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

export const initI18n = () => {
  extensionEvent.on('localeChanged', (locale: AnyListen.Locale) => {
    i18n.setLanguage(locale)
  })
  i18n.setLanguage(extensionState.locale)
}

import { settingEvent } from '@/modules/setting/store/event'
import { type Langs, type Locale, type Message, type TranslateValues, fillMessage, langList, messages } from '@any-listen/i18n'
import SingleEvent from '@any-listen/web/SimpleSingleEvent'
import { derived, writable } from 'svelte/store'

const $locale = writable<Locale>('zh-cn')

export const languageChangeEvent = new SingleEvent<[Langs]>()

const i18n = {
  locale: 'zh-cn' as Locale,
  fallbackLocale: 'zh-cn' as Langs,
  availableLocales: Object.keys(messages) as Langs[],
  messages,
  message: messages['zh-cn'],
  setLanguage(_locale: Langs) {
    if (!(_locale in messages)) {
      _locale = this.fallbackLocale
    }
    this.message = messages[_locale]
    this.locale = _locale
    $locale.set(_locale)
    languageChangeEvent.emit(_locale)
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

const getEnvLocale = () => {
  let langId: Langs | null = null
  const locale = window.navigator.language.toLocaleLowerCase() as Langs
  if (i18n.availableLocales.includes(locale)) {
    langId = locale
  } else {
    for (const lang of langList) {
      if (lang.alternate == locale) {
        langId = lang.locale
        break
      }
    }
    langId ??= 'en-us'
  }
  return langId
}

const setLanguage = (lang: Langs) => {
  i18n.setLanguage(lang)
  window.setLang(lang)
}

const initI18n = () => {
  setLanguage(getEnvLocale())
  settingEvent.on('updated', (keys, setting) => {
    if (!keys.includes('common.langId')) return
    setLanguage(setting['common.langId']!)
  })
}

export const t = derived($locale, () => i18n.getMessage.bind(i18n))

export { $locale as _locale, getEnvLocale, i18n, initI18n, langList, setLanguage }

export type { Langs, Message }

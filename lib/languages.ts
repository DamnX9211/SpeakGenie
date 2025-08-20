export interface Language {
  code: string
  name: string
  nativeName: string
  speechCode: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-US", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", speechCode: "es-ES", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", speechCode: "fr-FR", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", speechCode: "de-DE", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", speechCode: "it-IT", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", speechCode: "pt-BR", flag: "🇧🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", speechCode: "zh-CN", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", speechCode: "ja-JP", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", speechCode: "ko-KR", flag: "🇰🇷" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN", flag: "🇮🇳" },
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return supportedLanguages.find((lang) => lang.code === code)
}

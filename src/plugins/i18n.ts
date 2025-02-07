import { createI18n } from "vue-i18n";
import { defineNuxtPlugin } from "#app";

import en from "../../locales/en.json";
import ja from "../../locales/ja.json";

export default defineNuxtPlugin(({ vueApp  }) => {
  if (!vueApp.config.globalProperties.$i18n) { // すでに登録されていないか確認
    const i18n = createI18n({
      legacy: false, // Composition API
      globalInjection: true, // $tをグローバル化
      locale: 'ja', // 初期ロケール
      fallbackLocale: 'en-US', // 予備の言語
      messages: {
        'en-US': en, // 英語のメッセージ
        ja: ja, // 日本語のメッセージ
      }
    })
    vueApp.use(i18n)
  }
})

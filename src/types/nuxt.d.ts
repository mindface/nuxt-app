import { I18n } from "vue-i18n";
import type { ToastPluginApi } from "vue-toast-notification";

// NuxtApp 用の型定義
declare module '#app' {
  interface NuxtApp {
    $toast: ToastPluginApi;
    $t: I18n["global"]["t"];
  }
}

// Vue コンポーネント用の型定義
// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $toast: ToastPluginApi;  // 型を明示
//     $t: I18n["global"]["t"]; // 型を明示
//   }
// }

export { };


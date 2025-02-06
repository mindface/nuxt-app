<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
</script>

<template>
  <div class="login">
    <h1>{{ t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      <label for="locale-select">{{ t('language') }}: </label>
      <select id="locale-select" v-model="locale">
        <option value="en-US">en</option>
        <option value="fr">fr</option>
        <option value="ja">ja</option>
      </select>
    </form>
    <client-only>
      <content-user-register-login />
    </client-only>
  </div>
</template>

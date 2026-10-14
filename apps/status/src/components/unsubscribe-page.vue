<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { unsubscribeWithToken, type TokenResult } from '../api';

const props = defineProps<{
  slug: string;
  token: string;
}>();

const state = ref<TokenResult | 'working'>('working');

onMounted(async () => {
  if (!props.token) {
    state.value = 'invalid';
    return;
  }
  state.value = await unsubscribeWithToken(props.slug, props.token);
});
</script>

<template>
  <div class="status-token-page" role="status">
    <h1 v-if="state === 'working' || state === 'error'">Working on your request…</h1>
    <template v-else-if="state === 'unsubscribed'">
      <h1>You've been unsubscribed</h1>
      <p>You won't receive further incident updates for this status page.</p>
    </template>
    <template v-else>
      <h1>This unsubscribe link is invalid or expired</h1>
      <p>If you keep receiving updates, contact the page owner or reply to the latest notification email.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { confirmSubscription, type TokenResult } from '../api';

const props = defineProps<{
  slug: string;
  token: string;
}>();

const state = ref<TokenResult | 'working'>('working');

onMounted(async () => {
  state.value = await confirmSubscription(props.slug, props.token);
});
</script>

<template>
  <div class="status-token-page" role="status">
    <h1 v-if="state === 'working' || state === 'error'">Confirming your subscription…</h1>
    <template v-else-if="state === 'confirmed'">
      <h1>You're subscribed</h1>
      <p>You'll receive incident updates for this status page. You can unsubscribe anytime from any notification email.</p>
    </template>
    <template v-else>
      <h1>This confirmation link is invalid or expired</h1>
      <p>Confirmation links expire after 24 hours. Return to the status page and subscribe again for a fresh link.</p>
    </template>
  </div>
</template>

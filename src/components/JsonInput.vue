<template>
  <div>
    <label for="json-input" class="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
    <Textarea
      id="json-input"
      v-model="modelValue"
      rows="10"
      class="w-full p-2 surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded"
    />
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea';

const modelValue = defineModel<string>();
</script>
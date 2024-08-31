<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <label class="block text-sm font-medium text-gray-700">
        Preview {{ conversionDirection === 'jsonToCSV' ? 'CSV' : 'JSON' }}
      </label>
      <div class="space-x-2">
        <Button v-if="conversionDirection === 'csvToJSON' && conversionResult" @click="emit('copy-json')"
          class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2" icon="pi pi-copy"
          severity="contrast" />
        <Button @click="emit('download')" :disabled="!conversionResult" :class="[
          'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2',
          { 'cursor-not-allowed': !conversionResult }
        ]" :severity="conversionResult ? 'success' : 'secondary'"
          :label="`Download ${conversionDirection === 'jsonToCSV' ? 'CSV' : 'JSON'}`" />
      </div>
    </div>
    <div class="surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded rounded p-4 h-64 overflow-auto">
      <pre>{{ previewContent }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import type { ConversionDirection } from '../types';

interface Props {
  conversionDirection: ConversionDirection;
  conversionResult: string;
  previewContent: string;
}

type Emits = {
  'download': [];
  'copy-json': [];
}

defineProps<Props>();

const emit = defineEmits<Emits>();
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <!-- Left Column -->
    <div class="space-y-6">
      <JsonInput v-model="jsonInput" />
      <CsvUpload @file-selected="handleFileSelect($event, props.conversionDirection)" :selectedFile="selectedFile" />
    </div>

    <!-- Right Column -->
    <div class="space-y-6">
      <LanguageSelector v-model="selectedLanguages" :options="languageOptions" />
      <ConversionDirectionSelector :direction="conversionDirection" @clicked="emit('conversion-direction', $event)" />
      <Button @click="onConvert" class="w-full focus:outline-none focus:shadow-outline" label="Convert" severity="contrast" raised />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import JsonInput from './JsonInput.vue';
import CsvUpload from './CsvUpload.vue';
import LanguageSelector from './LanguageSelector.vue';
import ConversionDirectionSelector from './ConversionDirectionSelector.vue';
import { useConversion } from '../composables/useConversion';
import { languageOptions } from '../utils/languageOptions';
import type { ConversionResult, ConversionDirection } from '../types';

type Props = {
  conversionDirection: ConversionDirection;
}

type Emits = {
  'conversion-result': [result: ConversionResult];
  'conversion-direction': [direction: ConversionDirection];
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { 
  jsonInput, 
  selectedFile, 
  selectedLanguages, 
  handleFileSelect, 
  convert,
} = useConversion();

const onConvert = () => {
  const result = convert(props.conversionDirection);
  emit('conversion-result', result);
};
</script>
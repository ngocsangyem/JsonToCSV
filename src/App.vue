<template>
  <div class="card container mx-auto p-6 max-w-4xl">
    <ThemeSwitcher />
    <ConversionForm
      :conversionDirection="conversionDirection"
      @conversion-result="handleConversionResult"
      @conversion-direction="conversionDirection = $event"
    />
    <PreviewSection
      :conversionDirection="conversionDirection"
      :conversionResult="conversionResult"
      :previewContent="previewContent"
      @download="download(conversionDirection)"
      @copy-json="copyJSON(conversionDirection)"
    />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import ConversionForm from './components/ConversionForm.vue';
import PreviewSection from './components/PreviewSection.vue';
import { useConversion } from './composables/useConversion';
import type { ConversionResult } from './types';

const { conversionDirection, conversionResult, previewContent, download, copyJSON } = useConversion();

const handleConversionResult = (result: ConversionResult) => {
  conversionResult.value = result.conversionResult;
  previewContent.value = result.previewContent;
};
</script>
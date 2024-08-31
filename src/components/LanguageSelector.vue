<template>
  <div>
    <label for="language-select" class="block text-sm font-medium text-gray-700 mb-2">Languages</label>
    <MultiSelect
      id="language-select"
      v-model="modelValue"
      :options="options"
      option-label="label"
      @change="$emit('update:modelValue', $event.value)"
      filter
      placeholder="Select languages"
      :maxSelectedLabels="3"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import type { Language } from '../types';

type Props = {
  options: Language[];
}

defineProps<Props>();

const modelValue = defineModel<Language[]>();
</script>
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Conversion Direction</label>
    <div class="flex rounded-md shadow-sm">
      <ButtonGroup class="w-full block">
        <Button
          @click="handleClick('jsonToCSV')"
          class="flex-1 px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none focus:ring-2"
          :severity="direction === 'jsonToCSV' ? 'info' : 'secondary'"
          label="JSON to CSV"
        />
        <Button
          @click="handleClick('csvToJSON')"
          class="flex-1 px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2"
          :severity="direction === 'csvToJSON' ? 'info' : 'secondary'"
          label="CSV to JSON"
        />
      </ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import type { ConversionDirection } from '../types';

type Emits = {
  'clicked': [value: ConversionDirection];
}

type Props = {
  direction: ConversionDirection;
}

defineProps<Props>();

const emit = defineEmits<Emits>();

const handleClick = (value: ConversionDirection) => {
  emit('clicked', value);
};
</script>
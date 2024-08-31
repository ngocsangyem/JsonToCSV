<template>
  <div>
    <label for="csv-upload" class="block text-sm font-medium text-gray-700 mb-2">
      Upload CSV
      <template v-if="selectedFile">({{ selectedFile.name }})</template>
    </label>
    <FileUpload
      id="csv-upload"
      :multiple="false"
      customUpload
      auto
      severity="secondary"
      accept=".csv"
      :maxFileSize="1000000"
      :file-limit="1"
      @select="handleFileSelect"
      mode="basic"
      class="p-button-outline"
    />
  </div>
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import type { FileUploadSelectEvent } from 'primevue/fileupload';

type Props = {
  selectedFile: File | null;
}

type Emits = {
  'file-selected': [file: File];
}

defineProps<Props>();

const emit = defineEmits<Emits>();

const handleFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  if (file) {
    emit('file-selected', file);
  }
};
</script>

<style scoped>
:deep(.p-fileupload) {
  @apply justify-start;
}
</style>
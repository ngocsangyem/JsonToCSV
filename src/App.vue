<template>
  <div class="card container mx-auto p-6 max-w-4xl">
    <ThemeSwitcher />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Input JSON -->
        <div>
          <label for="json-input" class="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
          <Textarea id="json-input" v-model="jsonInput" rows="10" class="w-full p-2 surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded" />
        </div>

        <!-- Upload CSV -->
        <div>
          <label for="csv-upload" class="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV
            <template v-if="selectedFile">({{ selectedFile.name }})</template>
          </label>
          <FileUpload :multiple="false" customUpload auto severity="secondary" accept=".csv" :maxFileSize="1000000"
            :file-limit="1" @select="handleFileSelect($event)" mode="basic" class="p-button-outline" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Country Name Dropdown -->
        <div>
          <label for="country-select" class="block text-sm font-medium text-gray-700 mb-2">Country Name</label>
          <MultiSelect v-model="selectedLanguages" :options="languageOptions" option-label="label" filter
            placeholder="Select languages" :maxSelectedLabels="3" class="w-full" />
        </div>

        <!-- Conversion Direction Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Conversion Direction</label>
          <div class="flex rounded-md shadow-sm">
            <ButtonGroup class="w-full block">
              <Button @click="conversionDirection = 'jsonToCSV'"
                class="flex-1 px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none focus:ring-2"
                label="JSON to CSV" :severity="conversionDirection === 'jsonToCSV' ? 'info' : 'secondary'" />
              <Button @click="conversionDirection = 'csvToJSON'"
                class="flex-1 px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2"
                :severity="conversionDirection === 'csvToJSON' ? 'info' : 'secondary'" label="CSV to JSON" />
            </ButtonGroup>
          </div>
        </div>

        <!-- Submit Button -->
        <Button @click="handleConversion" class="w-full focus:outline-none focus:shadow-outline" label="Convert"
          severity="contrast" raised />
      </div>
    </div>

    <!-- Preview (Full Width) -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">
          Preview {{ conversionDirection === 'jsonToCSV' ? 'CSV' : 'JSON' }}
        </label>
        <div class="space-x-2">
          <Button v-if="conversionDirection === 'csvToJSON' && conversionResult" @click="copyJSON"
            class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2" icon="pi pi-copy"
            severity="contrast" />
          <Button @click="downloadResult" :disabled="!conversionResult" :class="[
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

    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import ButtonGroup from 'primevue/buttongroup';
import MultiSelect from 'primevue/multiselect';
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import { useToast } from 'primevue/usetoast';
import ThemeSwitcher from './components/ThemeSwitcher.vue'

type Language = {
  label: string;
  value: string;
};

const toast = useToast();

const jsonInput = ref('');
const selectedFile = ref<File>();
const selectedLanguages = ref<Language[]>([]);
const csvContent = ref('');
const conversionDirection = ref('jsonToCSV');
const previewContent = ref('');
const conversionResult = ref('');


// Mock list of countries (replace with actual data)
const languageOptions: Language[] = [
  {
    label: "Chinese",
    value: "zh"
  }, {
    label: "Bangladesh",
    value: "bn"
  }, {
    label: "Indonesia",
    value: "id"
  }
];

const languagesList = computed(() => selectedLanguages.value.map((language) => language.label));

const showError = (message: string) => {
  toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
};

const showSuccess = (message: string) => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: message, life: 3000 });
};

const handleFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      csvContent.value = String(e.target?.result) ?? '';

      if (conversionDirection.value === 'jsonToCSV') {
        conversionDirection.value = 'csvToJSON';
      }

      updatePreview();
    };
    reader.readAsText(file);
  }
};

const jsonToCsv = (jsonData: Record<string, string>, languages: Language['label'][]) => {
  const headers = ['Key', 'English', ...languages];
  const rows = [];

  // Iterate over each key in the JSON object
  for (const key in jsonData) {
    const row = [key, jsonData[key]];

    rows.push(row);
  }

  // Convert to CSV string
  const csvContent = [
    headers.join(','),  // Header row
    ...rows.map(row => row.join(','))  // Data rows
  ].join('\n');

  return csvContent;
}

const csvToJson = (content: string) => {
  const lines = content.trim().split('\n');

  const jsonData: Record<string, string> = {};

  // Iterate over each line in the CSV (skipping the header line)
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const key = row[0];  // First column is the key
    const value = row[1];  // Second column is the value

    // Populate the JSON object with key-value pairs
    jsonData[key] = value;
  }

  return jsonData;
}

const updatePreview = () => {
  if (conversionDirection.value === 'csvToJSON') {
    previewContent.value = csvContent.value.slice(0, 500);
  } else {
    previewContent.value = jsonInput.value.slice(0, 500);
  }
};

const handleConversion = () => {
  if (conversionDirection.value === 'csvToJSON') {
    // Convert CSV to JSON
    try {
      const result = csvToJson(csvContent.value);
      conversionResult.value = JSON.stringify(result, null, 2);
      previewContent.value = conversionResult.value.slice(0, 500);

      showSuccess('Conversion successful');
    } catch (error) {
      previewContent.value = 'Error converting CSV to JSON: ' + error.message;
      conversionResult.value = '';
      showError(previewContent.value);
    }
  } else {
    // Convert JSON to CSV
    try {
      const jsonData = JSON.parse(jsonInput.value);

      conversionResult.value = jsonToCsv(jsonData, languagesList.value);
      previewContent.value = conversionResult.value.slice(0, 500);

      showSuccess('Conversion successful');
    } catch (error) {
      previewContent.value = 'Error converting JSON to CSV: ' + error.message;
      conversionResult.value = '';
      showError(previewContent.value);
    }
  }
};

const downloadResult = () => {
  if (!conversionResult.value) return;

  const filename = conversionDirection.value === 'jsonToCSV' ? 'converted.csv' : 'converted.json';
  const mimeType = conversionDirection.value === 'jsonToCSV' ? 'text/csv' : 'application/json';

  const blob = new Blob([conversionResult.value], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showSuccess('Download successful');
};

const copyJSON = async () => {
  if (conversionResult.value && conversionDirection.value === 'csvToJSON') {
    try {
      await navigator.clipboard.writeText(conversionResult.value);
      showSuccess('JSON copied to clipboard');
    } catch (err) {
      console.error('Failed to copy JSON: ', err);
      showError('Failed to copy JSON');
    }
  }
};
</script>

<style scoped>
:deep(.p-fileupload-basic) {
  justify-content: start;
}
</style>
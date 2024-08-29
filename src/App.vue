<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Input JSON -->
        <div>
          <label for="json-input" class="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
          <Textarea id="json-input" v-model="jsonInput" rows="10"
            class="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <!-- Upload CSV -->
        <div>
          <label for="csv-upload" class="block text-sm font-medium text-gray-700 mb-2">Upload CSV</label>
          <div class="flex items-center justify-center w-full">
            <label for="csv-upload"
              class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and
                  drop</p>
                <p class="text-xs text-gray-500">CSV file</p>
              </div>
              <input id="csv-upload" type="file" class="hidden" @change="handleFileUpload" accept=".csv" />
            </label>
          </div>
          <p v-if="selectedFile" class="mt-2 text-sm text-gray-500">{{ selectedFile.name }}</p>
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
            class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2"
            icon="pi pi-copy"
            severity="contrast"  
          />
          <Button @click="downloadResult" :disabled="!conversionResult" :class="[
            'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2',
            { 'cursor-not-allowed': !conversionResult }
          ]" :severity="conversionResult ? 'success' : 'secondary'"
            :label="`Download ${conversionDirection === 'jsonToCSV' ? 'CSV' : 'JSON'}`" />
        </div>
      </div>
      <div class="border border-gray-300 rounded-md p-4 h-64 overflow-auto">
        <pre>{{ previewContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea';
import ButtonGroup from 'primevue/buttongroup';
import MultiSelect from 'primevue/multiselect';
import { ref } from 'vue';
import Button from 'primevue/button';

const jsonInput = ref('');
const selectedFile = ref(null);
const selectedLanguages = ref('');
const csvContent = ref('');
const conversionDirection = ref('jsonToCSV');
const previewContent = ref('');
const conversionResult = ref('');

// Mock list of countries (replace with actual data)
const languageOptions = [
  {
    label: "English",
    value: "en"
  }, {
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

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      csvContent.value = e.target.result;
      updatePreview();
    };
    reader.readAsText(file);
  }
};

const updatePreview = () => {
  if (conversionDirection.value === 'csvToJSON') {
    previewContent.value = csvContent.value.slice(0, 500) + '...';
  } else {
    previewContent.value = jsonInput.value.slice(0, 500) + '...';
  }
};

const handleConversion = () => {
  if (conversionDirection.value === 'csvToJSON') {
    // Convert CSV to JSON
    try {
      const lines = csvContent.value.split('\n');
      const headers = lines[0].split(',');
      const result = lines.slice(1).map(line => {
        const obj = {};
        const currentLine = line.split(',');
        headers.forEach((header, index) => {
          obj[header.trim()] = currentLine[index].trim();
        });
        return obj;
      });
      conversionResult.value = JSON.stringify(result, null, 2);
      previewContent.value = conversionResult.value.slice(0, 500) + '...';
    } catch (error) {
      previewContent.value = 'Error converting CSV to JSON: ' + error.message;
      conversionResult.value = '';
    }
  } else {
    // Convert JSON to CSV
    try {
      const jsonData = JSON.parse(jsonInput.value);
      if (!Array.isArray(jsonData)) {
        throw new Error('Input JSON must be an array of objects');
      }
      const headers = Object.keys(jsonData[0]);
      const csvRows = [
        headers.join(','),
        ...jsonData.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
      ];
      conversionResult.value = csvRows.join('\n');
      previewContent.value = conversionResult.value.slice(0, 500) + '...';
    } catch (error) {
      previewContent.value = 'Error converting JSON to CSV: ' + error.message;
      conversionResult.value = '';
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
};

const copyJSON = async () => {
  if (conversionResult.value && conversionDirection.value === 'csvToJSON') {
    try {
      await navigator.clipboard.writeText(conversionResult.value);
      alert('JSON copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy JSON: ', err);
      alert('Failed to copy JSON. Please try again.');
    }
  }
};
</script>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { jsonToCsv, csvToJson } from '../utils/conversionUtils';
import type { Language, ConversionDirection, ConversionResult } from '../types';

// Pure functions
export function handleConversion(
  conversionDirection: ConversionDirection,
  jsonInput: string,
  csvContent: string,
  languagesList: string[]
): ConversionResult {
  try {
    let result: string;
    if (conversionDirection === 'jsonToCSV') {
      const jsonData = JSON.parse(jsonInput);
      result = jsonToCsv(jsonData, languagesList);
    } else {
      result = JSON.stringify(csvToJson(csvContent), null, 2);
    }
    return { conversionResult: result, previewContent: result.slice(0, 500) };
  } catch (error) {
    const errorMessage = `Error during conversion: ${(error as Error).message}`;
    return { conversionResult: '', previewContent: errorMessage };
  }
}

export function updatePreview(
  conversionDirection: ConversionDirection,
  jsonInput: string,
  csvContent: string
): string {
  return conversionDirection === 'csvToJSON'
    ? csvContent.slice(0, 500)
    : jsonInput.slice(0, 500);
}

export function downloadResult(
  conversionResult: string,
  conversionDirection: ConversionDirection
): { url: string; filename: string } | null {
  if (!conversionResult) return null;

  const filename = conversionDirection === 'jsonToCSV' ? 'converted.csv' : 'converted.json';
  const mimeType = conversionDirection === 'jsonToCSV' ? 'text/csv' : 'application/json';

  const blob = new Blob([conversionResult], { type: mimeType });
  const url = URL.createObjectURL(blob);

  return { url, filename };
}

export function useConversion() {
  const toast = useToast();

  const jsonInput = ref('');
  const selectedFile = ref<File | null>(null);
  const selectedLanguages = ref<Language[]>([]);
  const csvContent = ref('');
  const conversionDirection = ref<ConversionDirection>('jsonToCSV');
  const previewContent = ref('');
  const conversionResult = ref('');

  const languagesList = computed(() => selectedLanguages.value.map((language) => language.label));

  const handleFileSelect = (file: File, direction: ConversionDirection) => {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      csvContent.value = e.target?.result as string || '';
      previewContent.value = updatePreview(direction, jsonInput.value, csvContent.value);
    };
    reader.readAsText(file);
  };

  const convert = (direction: ConversionDirection) => {
    const result = handleConversion(direction, jsonInput.value, csvContent.value, languagesList.value);
    conversionResult.value = result.conversionResult;
    previewContent.value = result.previewContent;
    if (result.conversionResult) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Conversion successful', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: result.previewContent, life: 3000 });
    }
    return result;
  };

  const download = (direction: ConversionDirection) => {
    const result = downloadResult(conversionResult.value, direction);
    if (result) {
      const { url, filename } = result;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Download successful', life: 3000 });
    }
  };

  const copyJSON = async (direction: ConversionDirection) => {
    if (conversionResult.value && direction === 'csvToJSON') {
      try {
        await navigator.clipboard.writeText(conversionResult.value);
        toast.add({ severity: 'success', summary: 'Success', detail: 'JSON copied to clipboard', life: 3000 });
      } catch (err) {
        console.error('Failed to copy JSON: ', err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy JSON', life: 3000 });
      }
    }
  };

  return {
    jsonInput,
    selectedFile,
    selectedLanguages,
    conversionDirection,
    previewContent,
    conversionResult,
    languagesList,
    handleFileSelect,
    convert,
    download,
    copyJSON,
  };
}
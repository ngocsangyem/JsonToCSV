export interface Language {
  label: string;
  value: string;
}

export interface ConversionResult {
  conversionResult: string;
  previewContent: string;
}

export type ConversionDirection = 'jsonToCSV' | 'csvToJSON';

export interface ConversionState {
  jsonInput: string;
  selectedFile: File | null;
  selectedLanguages: Language[];
  csvContent: string;
  conversionDirection: ConversionDirection;
  previewContent: string;
  conversionResult: string;
}
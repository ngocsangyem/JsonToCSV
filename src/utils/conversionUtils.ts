import type { Language } from '../types';

export function jsonToCsv(jsonData: Record<string, string>, languages: Language['label'][]): string {
  const headers = ['Key', 'English', ...languages];
  const rows = Object.entries(jsonData).map(([key, value]) => [key, value, ...Array(languages.length).fill('')]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function csvToJson(content: string): Record<string, string> {
  const lines = content.trim().split('\n');
  const result: Record<string, string> = {};

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const key = values[0];
    result[key] = values[1] || '';
  }

  return result;
}
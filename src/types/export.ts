export type ExportOptions = {
  format: 'pdf' | 'csv' | 'excel';
  filename: string;
  sections: string[];
  data?: Record<string, unknown>; // Optional data to be passed to the export function
  // Add other export options as needed
};
export type ImportResult = {
  success: boolean;
  filename: string;
  rows: number;
  importedAt: string;
  errors: string[];
};

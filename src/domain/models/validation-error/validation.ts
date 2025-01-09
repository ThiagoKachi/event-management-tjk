export interface ValidationError extends Error {
  success: boolean;
  error: any;
}

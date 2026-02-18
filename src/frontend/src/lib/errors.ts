import type { CameraError } from '../camera/useCamera';

export interface NormalizedError {
  message: string;
  canRetry: boolean;
  suggestedAction?: string;
}

export function normalizeError(error: CameraError): NormalizedError {
  switch (error.type) {
    case 'permission':
      return {
        message: 'Camera access denied. Please allow camera access in your browser settings.',
        canRetry: true,
        suggestedAction: 'Use the upload option below as an alternative.',
      };
    case 'not-supported':
      return {
        message: 'Camera is not supported on this device or browser.',
        canRetry: false,
        suggestedAction: 'Use the upload option below instead.',
      };
    case 'not-found':
      return {
        message: 'No camera found on this device.',
        canRetry: false,
        suggestedAction: 'Use the upload option below instead.',
      };
    case 'unknown':
      return {
        message: error.message || 'An unknown error occurred.',
        canRetry: true,
      };
    default:
      return {
        message: error.message || 'An unknown error occurred.',
        canRetry: true,
      };
  }
}

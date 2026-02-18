import type { ClassificationResult } from '../lib/classificationPipeline';
import { revokeTransferredPreview } from '../lib/imagePreview';

let currentResult: (ClassificationResult & { imageUrl?: string }) | null = null;

export function setScanResult(result: ClassificationResult & { imageUrl?: string }): void {
  // Clear previous result if exists
  if (currentResult?.imageUrl) {
    revokeTransferredPreview(currentResult.imageUrl);
  }
  currentResult = result;
}

export function getScanResult(): (ClassificationResult & { imageUrl?: string }) | null {
  return currentResult;
}

export function clearScanResult(): void {
  if (currentResult?.imageUrl) {
    revokeTransferredPreview(currentResult.imageUrl);
  }
  currentResult = null;
}

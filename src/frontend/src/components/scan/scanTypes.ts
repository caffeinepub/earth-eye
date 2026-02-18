export type ScanSource = 'camera' | 'upload';

export interface ScanState {
  mode: 'live' | 'confirmation' | 'processing' | 'error';
  source?: ScanSource;
  previewUrl?: string;
  previewFile?: File;
  error?: string;
}

export function getActionLabel(source: ScanSource, action: 'confirm' | 'discard'): string {
  if (action === 'confirm') {
    return 'Use Photo';
  }
  return source === 'camera' ? 'Retake' : 'Choose Different Image';
}

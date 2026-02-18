import { classifyWaste } from './mockClassifier';
import { useScanItem, useClassifyItemOffline } from '../hooks/useQueries';
import { addQueuedEvent } from './offlineQueue';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';

export interface ClassificationResult {
  itemType: string;
  disposalMethod: string;
  environmentalTip: string;
  funFact: string;
  points: number;
  imageUrl?: string;
}

export async function classifyFromText(text: string): Promise<ClassificationResult> {
  const result = classifyWaste(text);

  // Queue for backend sync if online and authenticated
  if (navigator.onLine && result.points > 0) {
    addQueuedEvent({
      input: text,
      timestamp: Date.now(),
      result,
    });
  }

  return result;
}

export async function classifyFromImage(file: File): Promise<ClassificationResult> {
  // For now, use a simple mock based on file name
  // In a real app, this would send the image to an AI service
  const fileName = file.name.toLowerCase();
  let input = 'unknown';

  if (fileName.includes('plastic') || fileName.includes('bottle')) {
    input = 'plastic bottle';
  } else if (fileName.includes('can') || fileName.includes('aluminum')) {
    input = 'aluminum can';
  } else if (fileName.includes('paper') || fileName.includes('cardboard')) {
    input = 'paper';
  } else if (fileName.includes('glass') || fileName.includes('jar')) {
    input = 'glass';
  } else if (fileName.includes('banana') || fileName.includes('organic')) {
    input = 'organic';
  }

  const result = classifyWaste(input);

  // Queue for backend sync if online and authenticated
  if (navigator.onLine && result.points > 0) {
    addQueuedEvent({
      input,
      timestamp: Date.now(),
      result,
    });
  }

  return result;
}

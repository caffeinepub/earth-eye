import type { ClassificationResult } from './classificationPipeline';

export async function shareResult(result: ClassificationResult): Promise<boolean> {
  const shareText = `I just classified ${result.itemType} with Earth Eye! 🌍\n\nDisposal: ${result.disposalMethod}\n\nTip: ${result.environmentalTip}\n\nJoin me in making a difference!`;

  // Try native share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Earth Eye Classification',
        text: shareText,
      });
      return true;
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return true;
  } catch (error) {
    console.error('Clipboard write failed:', error);
    return false;
  }
}

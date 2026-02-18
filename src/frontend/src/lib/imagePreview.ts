const activeUrls = new Set<string>();
const transferredUrls = new Set<string>();

export function createImagePreview(file: File): string {
  const url = URL.createObjectURL(file);
  activeUrls.add(url);
  return url;
}

export function revokeImagePreview(url: string): void {
  if (activeUrls.has(url) && !transferredUrls.has(url)) {
    URL.revokeObjectURL(url);
    activeUrls.delete(url);
  }
}

export function revokeAllPreviews(): void {
  activeUrls.forEach((url) => {
    if (!transferredUrls.has(url)) {
      URL.revokeObjectURL(url);
    }
  });
  activeUrls.clear();
}

export function transferPreview(url: string): void {
  // Mark this URL as transferred to another lifecycle (e.g., scan results)
  // so it won't be revoked by bulk cleanup
  if (activeUrls.has(url)) {
    transferredUrls.add(url);
    activeUrls.delete(url);
  }
}

export function revokeTransferredPreview(url: string): void {
  if (transferredUrls.has(url)) {
    URL.revokeObjectURL(url);
    transferredUrls.delete(url);
  }
}

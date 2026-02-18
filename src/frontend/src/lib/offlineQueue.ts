interface QueuedEvent {
  id: string;
  input: string;
  timestamp: number;
  result: any;
}

const QUEUE_KEY = 'earthEye_offlineQueue';
const MAX_QUEUE_SIZE = 100;

export function getQueuedEvents(): QueuedEvent[] {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addQueuedEvent(event: Omit<QueuedEvent, 'id'>): void {
  try {
    const queue = getQueuedEvents();
    const newEvent: QueuedEvent = {
      ...event,
      id: `${Date.now()}-${Math.random()}`,
    };

    queue.push(newEvent);

    // Keep only the most recent events
    if (queue.length > MAX_QUEUE_SIZE) {
      queue.splice(0, queue.length - MAX_QUEUE_SIZE);
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to queue event:', error);
  }
}

export function removeQueuedEvent(id: string): void {
  try {
    const queue = getQueuedEvents();
    const filtered = queue.filter((e) => e.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove queued event:', error);
  }
}

export function clearQueue(): void {
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear queue:', error);
  }
}

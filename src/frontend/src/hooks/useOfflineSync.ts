import { useEffect, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { getQueuedEvents, removeQueuedEvent } from '../lib/offlineQueue';
import { useQueryClient } from '@tanstack/react-query';

export function useOfflineSync() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncQueue = async () => {
    if (!actor || !identity || isSyncing) return;

    const queue = getQueuedEvents();
    if (queue.length === 0) return;

    setIsSyncing(true);
    setSyncError(null);

    for (const event of queue) {
      try {
        await actor.scanItem(event.input);
        removeQueuedEvent(event.id);
      } catch (error) {
        console.error('Sync error:', error);
        setSyncError('Some scans could not be synced');
        break;
      }
    }

    setIsSyncing(false);
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  };

  useEffect(() => {
    if (isOnline && actor && identity) {
      syncQueue();
    }
  }, [isOnline, actor, identity]);

  const retry = () => {
    setSyncError(null);
    syncQueue();
  };

  return {
    syncError,
    isOnline,
    isSyncing,
    retry,
  };
}

import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import BottomNav from './BottomNav';
import AuthButton from './AuthButton';
import ProfileSetupDialog from './ProfileSetupDialog';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { AlertCircle, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AppShell() {
  const { syncError, isOnline, retry } = useOfflineSync();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without offline support
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/earth-eye-logo.dim_512x512.png"
              alt="Earth Eye"
              className="h-8 w-8"
            />
            <span className="font-semibold text-foreground">Earth Eye</span>
          </div>
          <AuthButton />
        </div>
      </header>

      {!isOnline && (
        <div className="border-b border-border/40 bg-muted/50 px-4 py-2">
          <div className="container flex items-center gap-2 text-sm text-muted-foreground">
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {syncError && (
        <div className="border-b border-border/40 px-4 py-2">
          <Alert variant="destructive" className="container">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">Failed to sync your scans. {syncError}</span>
              <Button variant="outline" size="sm" onClick={retry} className="ml-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <BottomNav />
      <ProfileSetupDialog />
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getScanResult, clearScanResult } from '../state/scanSessionStore';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { shareResult } from '../lib/share';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, Home, Camera, Mic, LogIn, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ScanResults() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const result = getScanResult();

  useEffect(() => {
    if (!result) {
      navigate({ to: '/' });
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const handleShare = async () => {
    const success = await shareResult(result);
    if (success) {
      toast.success('Results shared successfully!');
    } else {
      toast.error('Failed to share results');
    }
  };

  const handleNewScan = () => {
    clearScanResult();
    navigate({ to: '/scan' });
  };

  const handleVoiceInput = () => {
    clearScanResult();
    navigate({ to: '/voice' });
  };

  return (
    <div className="container max-w-2xl space-y-4 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Classification Results</h1>
        <p className="text-muted-foreground">Here's what we found</p>
      </div>

      {result.imageUrl && (
        <Card>
          <CardContent className="p-0">
            <img
              src={result.imageUrl}
              alt="Scanned item"
              className="h-64 w-full rounded-t-lg object-cover"
            />
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{result.itemType}</CardTitle>
              <CardDescription className="mt-1">Classification complete</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg">
              +{result.points} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Disposal Method</h3>
            <p className="text-muted-foreground">{result.disposalMethod}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold text-foreground">Environmental Tip</h3>
            <p className="text-muted-foreground">{result.environmentalTip}</p>
          </div>

          <Separator />

          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Fun Fact</h3>
                <p className="text-sm text-muted-foreground">{result.funFact}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <LogIn className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Sign in to save your progress</p>
              <p className="text-sm text-muted-foreground">
                Track points, compete on the leaderboard, and more!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
        <Button onClick={handleNewScan} variant="default" className="flex-1">
          <Camera className="mr-2 h-4 w-4" />
          Scan Again
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleVoiceInput} variant="secondary" className="flex-1">
          <Mic className="mr-2 h-4 w-4" />
          Voice Input
        </Button>
        <Button onClick={() => navigate({ to: '/' })} variant="ghost" className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
    </div>
  );
}

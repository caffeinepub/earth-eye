import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { getDailyChallengeStatus } from '../lib/dailyChallenge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Trophy, Target, Calendar, LogIn, CheckCircle2 } from 'lucide-react';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { useNavigate } from '@tanstack/react-router';

export default function Profile() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: profile, isLoading, error, refetch } = useGetCallerUserProfile();

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Track your eco-friendly progress</p>
        </div>
        <EmptyState
          title="Sign In Required"
          description="Please sign in to view your profile and track your progress."
          icon={LogIn}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <ErrorState message="Failed to load profile. Please try again." onRetry={() => refetch()} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <EmptyState
          title="Profile Not Found"
          description="Your profile hasn't been created yet. Start scanning to create one!"
          action={{ label: 'Start Scanning', onClick: () => navigate({ to: '/scan' }) }}
        />
      </div>
    );
  }

  const dailyStatus = getDailyChallengeStatus(
    Number(profile.dailyChallengeProgress),
    Number(profile.lastScanTimestamp)
  );

  return (
    <div className="container max-w-2xl space-y-4 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Your eco-friendly journey</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{profile.displayName || 'Recycling Hero'}</CardTitle>
              <CardDescription>Member since joining</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 text-center">
              <Trophy className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-2xl font-bold">{profile.points.toString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-center">
              <Target className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-2xl font-bold">{profile.scanCount.toString()}</p>
              <p className="text-sm text-muted-foreground">Items Scanned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Daily Challenge</CardTitle>
            </div>
            {dailyStatus.isComplete && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </Badge>
            )}
          </div>
          <CardDescription>Scan 5 items today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {dailyStatus.progress} / {dailyStatus.target}
            </span>
          </div>
          <Progress value={(dailyStatus.progress / dailyStatus.target) * 100} />
          {dailyStatus.isComplete ? (
            <p className="text-sm text-primary">🎉 Challenge complete! +50 bonus points earned!</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {dailyStatus.target - dailyStatus.progress} more scans to complete today's challenge
            </p>
          )}
        </CardContent>
      </Card>

      {profile.scanHistory && profile.scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your last {profile.scanHistory.length} classifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.scanHistory.map((scan, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium">{scan.itemType}</p>
                    <p className="text-sm text-muted-foreground">{scan.disposalMethod}</p>
                  </div>
                  <Badge variant="outline">+{scan.points.toString()} pts</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

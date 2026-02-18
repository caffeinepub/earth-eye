import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetLeaderboard } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, LogIn } from 'lucide-react';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { useNavigate } from '@tanstack/react-router';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: leaderboard, isLoading, error, refetch } = useGetLeaderboard();

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See who's making the biggest impact</p>
        </div>
        <EmptyState
          title="Sign In Required"
          description="Please sign in to view the leaderboard and compete with other users."
          icon={LogIn}
          action={{ label: 'Go to Profile', onClick: () => navigate({ to: '/profile' }) }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl px-4 py-8">
        <LoadingState message="Loading leaderboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <ErrorState
          message="Failed to load leaderboard. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See who's making the biggest impact</p>
        </div>
        <EmptyState
          title="No Rankings Yet"
          description="Be the first to start scanning and earn points!"
          icon={Trophy}
          action={{ label: 'Start Scanning', onClick: () => navigate({ to: '/scan' }) }}
        />
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-2xl space-y-4 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">Top recyclers making a difference</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Users</CardTitle>
          <CardDescription>Ranked by total points earned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map(([name, points], index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex w-8 items-center justify-center">
                  {getRankIcon(index) || (
                    <span className="font-semibold text-muted-foreground">#{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{name}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-base">
                {points.toString()} pts
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Keep scanning to climb the leaderboard and make a bigger impact!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

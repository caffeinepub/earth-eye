import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Mic, Trophy, Info, Leaf } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Scan Garbage',
      description: 'Use your camera to identify waste',
      icon: Camera,
      path: '/scan',
      variant: 'default' as const,
    },
    {
      title: 'Voice Input',
      description: 'Describe waste with your voice',
      icon: Mic,
      path: '/voice',
      variant: 'secondary' as const,
    },
    {
      title: 'Leaderboard',
      description: 'See top recyclers',
      icon: Trophy,
      path: '/leaderboard',
      variant: 'outline' as const,
    },
    {
      title: 'About',
      description: 'Learn about Earth Eye',
      icon: Info,
      path: '/about',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="container max-w-2xl space-y-8 px-4 py-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <img
            src="/assets/generated/earth-eye-logo.dim_512x512.png"
            alt="Earth Eye Logo"
            className="h-32 w-32 drop-shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Earth Eye</h1>
          <p className="text-lg text-muted-foreground">
            Scan, classify, and dispose of waste responsibly
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.path}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigate({ to: action.path })}
            >
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Join thousands of users making a difference. Start scanning to earn points and climb the
            leaderboard!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

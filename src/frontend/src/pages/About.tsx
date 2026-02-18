import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Leaf, Camera, Mic, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container max-w-2xl space-y-6 px-4 py-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">About Earth Eye</h1>
        <p className="text-lg text-muted-foreground">
          Making waste disposal simple and sustainable
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Earth Eye helps you identify waste and provides guidance on the best disposal methods.
            Our goal is to make recycling and proper waste management accessible to everyone,
            reducing environmental impact one scan at a time.
          </p>
          <p className="text-muted-foreground">
            By using Earth Eye, you're joining a community of environmentally conscious individuals
            working together to create a cleaner, greener planet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Two easy ways to classify waste</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-semibold">Camera Scanning</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Navigate to the "Scan Garbage" page</li>
                <li>Allow camera access when prompted</li>
                <li>Point your camera at the waste item</li>
                <li>Tap "Capture" to take a photo</li>
                <li>View your results and disposal instructions</li>
              </ol>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-semibold">Voice Input</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Navigate to the "Voice Input" page</li>
                <li>Tap the microphone button</li>
                <li>Describe the waste item (e.g., "plastic bottle")</li>
                <li>Or type your description in the text box</li>
                <li>Tap "Classify" to get your results</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Points & Leaderboard</p>
              <p className="text-sm text-muted-foreground">
                Earn points for each scan and compete with others
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Daily Challenges</p>
              <p className="text-sm text-muted-foreground">
                Complete daily goals for bonus points
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Leaf className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Environmental Tips</p>
              <p className="text-sm text-muted-foreground">
                Learn how to reduce your environmental impact
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="space-y-3 p-6">
          <div className="text-center">
            <p className="mb-1 font-medium">Built with {' '}
              <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Earth Eye. Making the world cleaner, one scan at a time.
            </p>
          </div>
          <Separator />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Author: WAMIQ AHMAD
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { classifyFromText } from '../lib/classificationPipeline';
import { setScanResult } from '../state/scanSessionStore';
import { startSpeechRecognition, stopSpeechRecognition, isSpeechSupported } from '../lib/speechRecognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Loader2, AlertCircle, Send } from 'lucide-react';
import { normalizeError } from '../lib/errors';

export default function VoiceInput() {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = isSpeechSupported();

  useEffect(() => {
    return () => {
      if (isListening) {
        stopSpeechRecognition();
      }
    };
  }, [isListening]);

  const handleStartListening = () => {
    setError(null);
    setIsListening(true);
    startSpeechRecognition(
      (text) => {
        setTranscript(text);
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    stopSpeechRecognition();
    setIsListening(false);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const result = await classifyFromText(transcript);
      setScanResult(result);
      navigate({ to: '/results' });
    } catch (error) {
      console.error('Classification error:', error);
      setError('Failed to classify. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container max-w-2xl space-y-4 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Voice Input</h1>
        <p className="text-muted-foreground">Describe the waste item you want to classify</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!supported && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Speech recognition is not supported in your browser. Please use the text input below.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Voice Recognition</CardTitle>
          <CardDescription>
            {supported
              ? 'Click the microphone to start speaking'
              : 'Type your description below'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {supported && (
            <div className="flex justify-center">
              <Button
                size="lg"
                variant={isListening ? 'destructive' : 'default'}
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isProcessing}
                className="h-24 w-24 rounded-full"
              >
                {isListening ? (
                  <MicOff className="h-10 w-10 animate-pulse" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="e.g., plastic bottle, banana peel, aluminum can..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {isListening ? 'Listening... Speak now' : 'Or type your description'}
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!transcript.trim() || isProcessing || isListening}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Classifying...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Classify
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Be specific! Say "plastic water bottle" instead of just "bottle"
            for better results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

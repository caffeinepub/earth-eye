let recognition: any = null;

export function isSpeechSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (error: string) => void
): void {
  if (!isSpeechSupported()) {
    onError('Speech recognition is not supported in your browser');
    return;
  }

  try {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        onError('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        onError('No speech detected. Please try again.');
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.start();
  } catch (error) {
    onError('Failed to start speech recognition');
  }
}

export function stopSpeechRecognition(): void {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

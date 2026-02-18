import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCamera } from '../camera/useCamera';
import { classifyFromImage, classifyFromText } from '../lib/classificationPipeline';
import { setScanResult } from '../state/scanSessionStore';
import { createImagePreview, revokeImagePreview, revokeAllPreviews, transferPreview } from '../lib/imagePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Loader2, AlertCircle, RotateCw } from 'lucide-react';
import { ErrorState } from '../components/States';
import { normalizeError } from '../lib/errors';
import { CameraGuidanceOverlay } from '../components/scan/CameraGuidanceOverlay';
import { ScanConfirmation } from '../components/scan/ScanConfirmation';
import type { ScanState, ScanSource } from '../components/scan/scanTypes';

export default function ScanCamera() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanState, setScanState] = useState<ScanState>({
    mode: 'live',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
    quality: 0.9,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
      revokeAllPreviews();
    };
  }, [isActive, stopCamera]);

  const handleCapture = async () => {
    try {
      const photo = await capturePhoto();
      if (photo) {
        const previewUrl = createImagePreview(photo);
        setScanState({
          mode: 'confirmation',
          source: 'camera',
          previewUrl,
          previewFile: photo,
        });
      }
    } catch (error) {
      console.error('Capture error:', error);
      setScanState({
        mode: 'error',
        error: 'Failed to capture photo. Please try again.',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview if exists
    if (scanState.previewUrl) {
      revokeImagePreview(scanState.previewUrl);
    }

    const previewUrl = createImagePreview(file);
    setScanState({
      mode: 'confirmation',
      source: 'upload',
      previewUrl,
      previewFile: file,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = async (description?: string) => {
    if (!scanState.previewFile || !scanState.previewUrl) return;

    setIsProcessing(true);

    try {
      let result;
      
      if (description) {
        // Use text classification if description provided
        result = await classifyFromText(description);
      } else {
        // Use image classification
        result = await classifyFromImage(scanState.previewFile);
      }

      // Transfer the preview URL to the results lifecycle
      transferPreview(scanState.previewUrl);
      
      setScanResult({ ...result, imageUrl: scanState.previewUrl });
      navigate({ to: '/results' });
    } catch (error) {
      console.error('Classification error:', error);
      setIsProcessing(false);
      setScanState((prev) => ({
        ...prev,
        mode: 'error',
        error: 'Failed to classify the item. Please try again.',
      }));
    }
  };

  const handleDiscard = () => {
    // Revoke the preview URL
    if (scanState.previewUrl) {
      revokeImagePreview(scanState.previewUrl);
    }

    if (scanState.source === 'camera') {
      // Return to live camera view
      setScanState({ mode: 'live' });
    } else {
      // For upload, return to live view and allow new selection
      setScanState({ mode: 'live' });
    }
  };

  const handleRetryAfterError = () => {
    // Revoke preview if exists
    if (scanState.previewUrl) {
      revokeImagePreview(scanState.previewUrl);
    }

    if (scanState.source === 'camera') {
      setScanState({ mode: 'live' });
    } else {
      setScanState({ mode: 'live' });
      // Trigger file picker
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  };

  const normalizedError = cameraError ? normalizeError(cameraError) : null;

  if (isSupported === false) {
    return (
      <div className="container max-w-2xl space-y-4 px-4 py-8">
        <ErrorState
          title="Camera Not Supported"
          message="Your browser doesn't support camera access. Please use the upload option below."
        />
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image of waste to classify</CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="file-upload">
              <Button asChild variant="outline" className="w-full">
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </span>
              </Button>
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-4 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Scan Garbage</h1>
        <p className="text-muted-foreground">
          {scanState.mode === 'confirmation'
            ? 'Review and confirm your photo'
            : 'Point your camera at waste to identify it'}
        </p>
      </div>

      {normalizedError && scanState.mode === 'live' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{normalizedError.message}</p>
              <div className="flex gap-2">
                {normalizedError.canRetry && (
                  <Button size="sm" variant="outline" onClick={retry}>
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {scanState.mode === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{scanState.error}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRetryAfterError}>
                  {scanState.source === 'camera' ? 'Retake' : 'Choose Different Image'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDiscard}>
                  Cancel
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {scanState.mode === 'confirmation' && scanState.previewUrl && scanState.source && (
        <ScanConfirmation
          previewUrl={scanState.previewUrl}
          source={scanState.source}
          isProcessing={isProcessing}
          onConfirm={handleConfirm}
          onDiscard={handleDiscard}
        />
      )}

      {(scanState.mode === 'live' || scanState.mode === 'error') && (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ minHeight: '300px' }}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {isActive && <CameraGuidanceOverlay />}
                
                {!isActive && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Camera className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                {!isActive ? (
                  <Button
                    onClick={startCamera}
                    disabled={cameraLoading}
                    className="w-full"
                  >
                    {cameraLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Camera...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCapture}
                      disabled={cameraLoading}
                      className="flex-1"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture
                    </Button>
                    <Button
                      onClick={() => switchCamera()}
                      disabled={cameraLoading}
                      variant="outline"
                      size="icon"
                      className="hidden sm:flex"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Or Upload Image</CardTitle>
              <CardDescription>Select an image from your device</CardDescription>
            </CardHeader>
            <CardContent>
              <label htmlFor="file-upload-alt">
                <Button asChild variant="outline" className="w-full">
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </span>
                </Button>
              </label>
              <input
                ref={fileInputRef}
                id="file-upload-alt"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

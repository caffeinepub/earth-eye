import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, X } from 'lucide-react';
import type { ScanSource } from './scanTypes';
import { getActionLabel } from './scanTypes';

interface ScanConfirmationProps {
  previewUrl: string;
  source: ScanSource;
  isProcessing: boolean;
  onConfirm: (description?: string) => void;
  onDiscard: () => void;
}

export function ScanConfirmation({
  previewUrl,
  source,
  isProcessing,
  onConfirm,
  onDiscard,
}: ScanConfirmationProps) {
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    onConfirm(description.trim() || undefined);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-64 w-full rounded-t-lg object-cover"
          />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="item-description">
          What is it? <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="item-description"
          type="text"
          placeholder="e.g., plastic bottle, aluminum can, banana peel"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isProcessing}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Describe the item for more accurate classification
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {getActionLabel(source, 'confirm')}
            </>
          )}
        </Button>
        <Button
          onClick={onDiscard}
          disabled={isProcessing}
          variant="outline"
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          {getActionLabel(source, 'discard')}
        </Button>
      </div>
    </div>
  );
}

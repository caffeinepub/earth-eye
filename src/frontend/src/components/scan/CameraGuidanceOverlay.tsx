import { Lightbulb } from 'lucide-react';

export function CameraGuidanceOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col">
      {/* Framing guide */}
      <div className="absolute inset-4 rounded-lg border-2 border-white/40 shadow-lg">
        <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-white" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-white" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white" />
      </div>

      {/* Tips overlay */}
      <div className="mt-auto bg-gradient-to-t from-black/70 to-transparent p-4 pb-6">
        <div className="flex items-start gap-2 text-white">
          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-medium">Tips for best results:</p>
            <ul className="space-y-0.5 text-xs text-white/90">
              <li>• Center the item in the frame</li>
              <li>• Ensure good lighting</li>
              <li>• Keep the camera steady</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

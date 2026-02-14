import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2 } from 'lucide-react';

export function ModelSettingsPage() {
  return (
    <div className="flex flex-col gap-8 p-8" data-testid="model-settings-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Model Settings
        </h1>
        <p className="text-muted-foreground text-lg italic">
          Configure Ollama model parameters and behavior.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Model configuration will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

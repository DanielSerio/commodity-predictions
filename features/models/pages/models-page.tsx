import { getAllModels } from '@/repositories/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';

export async function ModelsPage() {
  const models = getAllModels();

  return (
    <div className="flex flex-col gap-8 p-8" data-testid="models-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Models</h1>
        <p className="text-muted-foreground text-lg italic">
          Ollama-powered models registered for commodity price forecasting.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Cpu className="h-4 w-4 text-primary" />
              <CardTitle>{model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="font-mono">
                {model.slug}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

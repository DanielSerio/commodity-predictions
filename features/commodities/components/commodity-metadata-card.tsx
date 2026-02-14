import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommodityMetadataCardProps {
  slug: string;
  id: number;
  createdAt: Date;
}

export function CommodityMetadataCard({
  slug,
  id,
  createdAt,
}: CommodityMetadataCardProps) {
  return (
    <Card data-testid="commodity-metadata-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Key Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-sm text-muted-foreground font-medium">
            System Slug
          </span>
          <span className="text-sm font-mono">{slug}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-sm text-muted-foreground font-medium">
            Tracing ID
          </span>
          <span className="text-sm font-mono">#{id}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground font-medium">
            Created At
          </span>
          <span className="text-sm">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

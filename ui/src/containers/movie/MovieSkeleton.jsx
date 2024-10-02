import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-3/4 h-8" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-1/2 h-4 mb-2" />
        <Skeleton className="w-1/3 h-4 mb-2" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4 mt-2" />
        <Skeleton className="w-3/4 h-4 mt-2" />
      </CardContent>
    </Card>
  );
}

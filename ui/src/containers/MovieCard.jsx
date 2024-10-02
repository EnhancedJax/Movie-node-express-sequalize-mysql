import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function MovieCard({ movie }) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/movie/${movie.id}`)}
      className="cursor-pointer"
    >
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>{`Duration: ${movie.duration} minutes`}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{movie.description}</p>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MovieDetails({ movie }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Duration:</strong> {movie.duration} minutes
        </p>
        <p>
          <strong>Release Date:</strong>{" "}
          {movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString()
            : "Not available"}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {movie.description || "No description available"}
        </p>
      </CardContent>
    </Card>
  );
}

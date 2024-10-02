"use client";
import { useMovies } from "@/app/create/movies/provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react"; // Import icons
import MovieModal from "./MovieModal";

export default function MoviesList() {
  const {
    movies,
    setSelectedMovie,
    setIsModalOpen,
    handleDeleteMovie,
    seeAll,
    setSeeAll,
  } = useMovies();

  const handleAddNew = () => {
    setSelectedMovie(null);
    setIsModalOpen(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Movies</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddNew}>Add New</Button>
          <Button onClick={() => setSeeAll(!seeAll)}>
            {seeAll ? "Show All" : "Hide Deleted"}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.duration} min</TableCell>
              <TableCell>
                {new Date(movie.releaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(movie)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MovieModal />
    </div>
  );
}

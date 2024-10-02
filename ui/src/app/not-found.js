import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-800">Not Found</h2>
        <p className="mb-8 text-xl text-gray-600">
          Could not find requested resource
        </p>
        <Link href="/" passHref>
          <Button variant="default" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

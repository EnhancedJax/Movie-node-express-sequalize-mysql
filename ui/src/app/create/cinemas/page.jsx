"use client";
import CinemasList from "@/containers/create/cinemas/CinemasList";
import { CinemasProvider } from "./provider";

export default function CinemasPage() {
  return (
    <CinemasProvider>
      <CinemasList />
    </CinemasProvider>
  );
}

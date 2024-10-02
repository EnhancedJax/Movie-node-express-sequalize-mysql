"use client";
import ScreeningManager from "@/containers/create/screenings/ScreeningManager";
import { ScreeningProvider } from "./provider";

export default function ScreeningPage() {
  return (
    <ScreeningProvider>
      <ScreeningManager />
    </ScreeningProvider>
  );
}

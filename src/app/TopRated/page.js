"use client";

import Image from "next/image";
import { Header } from "../Features/Header";
import { Footer } from "../Features/Footer";
import { TopRated } from "../Features/TopRated";

export default function TopRatedPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      <Header />
      <div className="w-full max-w-7xl flex flex-col gap-13 mt-13 shrink-0">
        <TopRated />
      </div>
      <Footer />
    </div>
  );
}

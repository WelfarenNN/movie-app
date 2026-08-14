"use client";

import Image from "next/image";
import { HeroSection } from "./features/HeroSection";
import { Footer } from "./features/Footer";
import { Header } from "./features/Header";
import { UpComing } from "./features/UpComing";
import { Popular } from "./features/Popular";
import { TopRated } from "./features/TopRated";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
        <Header />
        <HeroSection />
        <div className="w-full max-w-7xl flex flex-col gap-13 mt-13 shrink-0">
          <UpComing />
          <Popular />
          <TopRated />
        </div>
        <Footer />
      </div>
    </div>
  );
}

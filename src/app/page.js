"use client";

import Image from "next/image";
import { HeroSection } from "./Features/HeroSection";
import { Footer } from "./Features/Footer";
import { Header } from "./Features/Header";
import { UpComing } from "./Features/UpComing";
import { Popular } from "./Features/Popular";
import { TopRated } from "./Features/TopRated";

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

"use client";

import Image from "next/image";
import { Header } from "../features/Header";
import { Footer } from "../features/Footer";
import { Popular } from "../features/Popular";

export default function PopularPage() {
  return (
      <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
        <Header />
        <div className="w-full max-w-7xl flex flex-col gap-13 mt-13 shrink-0">
          <Popular />
          <div>
            
          </div>
        </div>
        <Footer />
      </div>
  );
}

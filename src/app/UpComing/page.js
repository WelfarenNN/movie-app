"use client";

import Image from "next/image";
import { Footer } from "./features/Footer";
import { Header } from "./features/Header";
import { UpComing } from "../features/UpComing";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
        <Header />
        <div className="w-full max-w-7xl flex flex-col gap-13 mt-13 shrink-0">
          <UpComing />
        </div>
        <Footer />
      </div>
    </div>
  );
}
